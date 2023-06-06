import { rest } from "msw";
import { server } from "../../mocks/server";
import { checkOption, fillForm, render, screen, testRenderForm, waitFor } from "../../test-utils";
import * as router from 'react-router'
import VisitEditOwner from "./VisitEditOwner";

const navigate = jest.fn()

beforeEach(() => {
    jest.spyOn(router, 'useNavigate').mockImplementation(() => navigate);
})

describe('VisitEditOwner', () => {
    const form = [
        [/date and time/i, "label", "2020-01-02T15:30:00"],
        [/description/i, "textbox", "test description"],
        [/vet/i, "combobox", "1"],
        [/pet/i, "textbox", "1", "disabled"]
    ];
    const route = '/pets/1/visits/new'

    test('renders correctly', async () => {
        render(<VisitEditOwner />, { route: route })
        testRenderForm(/add visit/i, form);
    });

    test('creates visit correctly', async () => {
        const { user } = render(<VisitEditOwner />, { route: route });

        const city = await screen.findByRole('radio', { name: /sevilla/i })
        await user.click(city);
        expect(city).toBeChecked()

        await fillForm(user, form);

        const submit = screen.getByRole('button', { name: /save/i })
        await user.click(submit);

        await waitFor(async () => expect(navigate).toHaveBeenCalledWith('/pets/1/visits'));
    });

    test('creates visit with exception', async () => {
        server.use(
            rest.post('*/pets/1/visits', (req, res, ctx) => {
                return res(
                    ctx.status(404),
                    ctx.json(
                        {
                            message: 'Error creating visit'
                        }
                    )
                )
            })
        )
        const { user } = render(<VisitEditOwner />, { route: route });
        const city = await screen.findByRole('radio', { name: /sevilla/i })
        await user.click(city);
        await waitFor(async () => expect(city).toBeChecked());
        await checkOption(/james/i);
        await fillForm(user, form);

        const submit = screen.getByRole('button', { name: /save/i })
        await user.click(submit);

        expect(navigate).not.toHaveBeenCalledWith('/pets/1/visits');

        const modal = await screen.findByRole('dialog');
        expect(modal).toBeInTheDocument();
    });

    test('back button works correctly', async () => {
        window.history.back = jest.fn();
        const { user } = render(<VisitEditOwner />, { route: route });

        const back = await screen.findByRole('button', { 'name': /back/i });
        await user.click(back);
        expect(window.history.back).toHaveBeenCalled();
    });

    test('changes city correctly for basic', async () => {
        server.use(
            rest.get('/api/v1/pets/1', (req, res, ctx) => {
                return res(
                    ctx.status(200),
                    ctx.json(
                        {
                            "id": 1,
                            "owner": { "plan": "BASIC" }
                        }
                    )
                )
            })
        )
        const { user } = render(<VisitEditOwner />, { route: 'pets/1/visits/1' })
        const heading = await screen.findByRole('heading', { 'name': /edit visit/i });
        expect(heading).toBeInTheDocument();
        const sevilla = await screen.findByRole('radio', { name: /sevilla/i })
        expect(sevilla).toBeChecked()

        const badajoz = await screen.findByRole('radio', { name: /badajoz/i })
        await user.click(badajoz);
        expect(badajoz).toBeChecked()
    });

    test('edit future visit renders correctly', async () => {
        const { user } = render(<VisitEditOwner />, { route: 'pets/1/visits/1' })
        const heading = await screen.findByRole('heading', { 'name': /edit visit/i });
        expect(heading).toBeInTheDocument();
        const city = await screen.findByRole('radio', { name: /sevilla/i })
        await user.click(city);
        expect(city).toBeChecked();

        const submit = screen.getByRole('button', { name: /save/i })
        await user.click(submit);

        await waitFor(async () => expect(navigate).toHaveBeenCalledWith('/pets/1/visits'));
    });

    test('edits past visit', async () => {
        server.use(
            rest.get('*/api/v1/pets/:petId/visits/:id', (req, res, ctx) => {
                return res(
                    ctx.status(200),
                    ctx.json(
                        {
                            "id": 1,
                            "datetime": "2020-01-01T13:00:00",
                            "description": "rabies shot",
                            "vet": { "city": "Badajoz" },
                            "city": "Badajoz",
                        }
                    )
                )
            })
        )
        const auxForm = form;
        auxForm[0] = [/date and time/i, "label", "2020-01-02T15:30:00", "readonly"];
        const { user } = render(<VisitEditOwner />, { route: 'pets/1/visits/1' });
        const city = await screen.findByRole('radio', { name: /sevilla/i });
        expect(city).toBeDisabled()

        const submit = screen.getByRole('button', { name: /save/i })
        await user.click(submit);

        await waitFor(async () => expect(navigate).toHaveBeenCalledWith('/pets/1/visits'));
    });
});
import { rest } from "msw";
import { server } from "../mocks/server";
import { checkOption, fillForm, render, screen, testRenderForm, waitFor } from "../test-utils";
import * as router from 'react-router'
import tokenService from "../services/token.service";
import VisitCreate from "./VisitCreate";

const navigate = jest.fn()

beforeEach(() => {
    jest.spyOn(router, 'useNavigate').mockImplementation(() => navigate)
})

describe('VisitCreate', () => {
    const form = [
        [/date and time/i, "label", "2020-01-02T15:30:00"],
        [/description/i, "textbox", "test description"],
        [/pet/i, "combobox", "1"]
    ];
    const formOwner = [
        [/date and time/i, "label", "2020-01-02T15:30:00"],
        [/description/i, "textbox", "test description"],
        [/pet/i, "combobox", "1"],
        [/vet/i, "combobox", "1"]
    ];
    const route = '/visits/new';

    beforeAll(() => {
        tokenService.setUser({ id: 1 })
    });

    test('renders correctly for vets', async () => {
        render(<VisitCreate auth={"VET"} />, { route: route })
        testRenderForm(/add visit/i, form);
    });


    test('creates visit correctly for vets', async () => {
        const { user } = render(<VisitCreate auth={"VET"} />, { route: route });

        await checkOption(/leo/i);

        await fillForm(user, form);

        const submit = screen.getByRole('button', { name: /save/i })
        await user.click(submit);

        await waitFor(async () => expect(navigate).toHaveBeenCalledWith('/visits'));
    });

    test('renders correctly for owners', async () => {
        render(<VisitCreate auth={"OWNER"} />, { route: route })
        testRenderForm(/add visit/i, formOwner);
    });


    test('creates visit correctly for owners', async () => {
        const { user } = render(<VisitCreate auth={"OWNER"} />, { route: route });

        await checkOption(/leo/i);
        const city = await screen.findByRole('radio', { name: /sevilla/i })
        await user.click(city);
        expect(city).toBeChecked();
        await checkOption(/james/i);

        await fillForm(user, formOwner);

        const submit = screen.getByRole('button', { name: /save/i })
        await user.click(submit);

        await waitFor(async () => expect(navigate).toHaveBeenCalledWith('/pets/1/visits'));
    });

    test('renders correctly for basic owners', async () => {
        render(<VisitCreate auth={"OWNER"} />, { route: route })
        testRenderForm(/add visit/i, formOwner);
    });


    test('changes city correctly for basic', async () => {
        server.use(
            rest.get('/api/v1/owners/profile', (req, res, ctx) => {
                return res(
                    ctx.status(200),
                    ctx.json(
                        {
                            plan: "BASIC"
                        }
                    )
                )
            })
        )
        const { user } = render(<VisitCreate auth={"OWNER"} />, { route: route })
        const sevilla = await screen.findByRole('radio', { name: /sevilla/i })
        await user.click(sevilla);
        expect(sevilla).toBeChecked()

        const badajoz = await screen.findByRole('radio', { name: /badajoz/i })
        await user.click(badajoz);
        expect(badajoz).toBeChecked()
    });

    test('back button works correctly', async () => {
        const { user } = render(<VisitCreate auth={"VET"} />, { route: route });
        const back = screen.getByRole('button', { 'name': /back/i });
        await user.click(back);

        expect(navigate).toHaveBeenCalledWith(-1);
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
        const { user } = render(<VisitCreate auth={"VET"} />, { route: route });
        await checkOption(/leo/i);
        await fillForm(user, form);

        const submit = screen.getByRole('button', { name: /save/i })
        await user.click(submit);

        expect(navigate).not.toHaveBeenCalledWith('/visits');

        const modal = await screen.findByRole('dialog');
        expect(modal).toBeInTheDocument();
    });
});
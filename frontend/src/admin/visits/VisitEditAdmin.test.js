import { rest } from "msw";
import { server } from "../../mocks/server";
import { checkOption, fillForm, render, screen, testFilledEditForm, testRenderForm, waitFor } from "../../test-utils";
import * as router from 'react-router'
import VisitEditAdmin from "./VisitEditAdmin";
import tokenService from "../../services/token.service";

const navigate = jest.fn()

beforeEach(() => {
    jest.spyOn(router, 'useNavigate').mockImplementation(() => navigate)
})

describe('VisitEditAdmin', () => {
    const form = [
        [/date and time/i, "label", "2020-01-02T15:30:00"],
        [/description/i, "textbox", "test description"],
        [/vet/i, "combobox", "1"],
        [/pet/i, "textbox", "1", "disabled"]
    ];
    const route = '/pets/1/visits/new';

    beforeAll(() => {
        tokenService.setUser({ id: 1 })
    });

    test('renders correctly', async () => {
        render(<VisitEditAdmin />, { route: route })
        testRenderForm(/add visit/i, form);
    });

    test('renders correctly for vets', async () => {
        render(<VisitEditAdmin admin={false} />, { route: route })
        testRenderForm(/visit details/i, form);
    });

    test('creates visit correctly', async () => {
        const { user } = render(<VisitEditAdmin />, { route: route });

        await checkOption(/james/i);

        await fillForm(user, form);

        const submit = screen.getByRole('button', { name: /save/i })
        await user.click(submit);

        await waitFor(async () => expect(navigate).toHaveBeenCalledWith('/pets/1/visits'));
    });

    test('edit visit renders correctly', async () => {
        const { user } = render(<VisitEditAdmin />, { route: 'pets/1/visits/1' })
        const heading = await screen.findByRole('heading', { 'name': /edit visit/i });
        expect(heading).toBeInTheDocument();
        await checkOption(/james/i);

        await testFilledEditForm(form)

        const submit = screen.getByRole('button', { name: /save/i })
        await user.click(submit);

        await waitFor(async () => expect(navigate).toHaveBeenCalledWith('/pets/1/visits'));
    });

    test('back button works correctly', async () => {
        const { user } = render(<VisitEditAdmin />, { route: route });
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
        const { user } = render(<VisitEditAdmin />, { route: route });
        await checkOption(/james/i);
        await fillForm(user, form);

        const submit = screen.getByRole('button', { name: /save/i })
        await user.click(submit);

        expect(navigate).not.toHaveBeenCalledWith('/pets/1/visits');

        const modal = await screen.findByRole('dialog');
        expect(modal).toBeInTheDocument();
    });
});
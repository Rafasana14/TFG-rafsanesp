import { render, screen } from "../../test-utils";
import * as router from 'react-router'
import SpecialtiesChange from "./SpecialtiesChange";

const navigate = jest.fn()

beforeEach(() => {
    jest.spyOn(router, 'useNavigate').mockImplementation(() => navigate)
})

describe('SpecialtiesChange', () => {

    test('renders correctly', async () => {
        render(<SpecialtiesChange />)
        const heading = screen.getByRole('heading', { 'name': /change specialties/i });
        expect(heading).toBeInTheDocument();
    });

    test('select specialty works correctly', async () => {
        const { user } = render(<SpecialtiesChange />, { route: '/vets/1' })
        const heading = await screen.findByRole('heading', { 'name': /change specialties/i });
        expect(heading).toBeInTheDocument();

        const dentistry = await screen.findByLabelText(/dentistry/i);
        await user.click(dentistry);
        const radiology = await screen.findByLabelText(/radiology/i);
        expect(radiology).toBeChecked();
        await user.click(radiology);
        expect(radiology).not.toBeChecked();

        const submit = screen.getByRole('button', { name: /save/i })
        await user.click(submit);

        const alert = await screen.findByRole('alert');
        expect(alert).toBeInTheDocument();
    });

    test('back button works correctly', async () => {
        const { user } = render(<SpecialtiesChange />);
        const back = screen.getByRole('button', { 'name': /back/i });
        await user.click(back);

        expect(navigate).toHaveBeenCalledWith(-1);
    });
});
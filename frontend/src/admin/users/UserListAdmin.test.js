import tokenService from "../../services/token.service";
import { render, screen, testRenderList } from "../../test-utils";
import UserListAdmin from "./UserListAdmin";

describe('UserListAdmin', () => {
    test('renders correctly', async () => {
        render(<UserListAdmin test={true} />);
        testRenderList(/users/i);
    });

    test('renders users correctly', async () => {
        tokenService.setUser({ id: 1 })
        render(<UserListAdmin test={true} />);
        const owner1 = await screen.findByRole('cell', { 'name': 'owner1' });
        expect(owner1).toBeInTheDocument();

        const editButtons = await screen.findAllByRole('link', { 'name': /edit/ });
        expect(editButtons).toHaveLength(2);

        const deleteButtons = await screen.findAllByRole('button', { 'name': /delete/ });
        expect(deleteButtons).toHaveLength(1);

        const admin1 = await screen.findByRole('cell', { 'name': 'admin1' });
        expect(admin1).toBeInTheDocument();

        const owners = await screen.findAllByRole('row', {},);
        expect(owners).toHaveLength(3);
    });

    test('delete user correct', async () => {
        const jsdomConfirm = window.confirm;
        window.confirm = () => { return true };
        const { user } = render(<UserListAdmin test={true} />);

        const user1Delete = await screen.findByRole('button', { 'name': 'delete-2' });
        await user.click(user1Delete);
        const alert = await screen.findByRole('alert');
        expect(alert).toBeInTheDocument();

        window.confirm = jsdomConfirm;
    });
});
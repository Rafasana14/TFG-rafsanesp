import { render, screen, waitFor } from "../test-utils";
import Logout from "./Logout.js";

describe('Logout', () => {
    const realLocation = window.location;

    beforeAll(() => {
        delete window.location
        window.location = { ...realLocation, assign: jest.fn(), reload: jest.fn() }
    })

    afterAll(() => {
        window.location = realLocation
    })

    test('renders correctly', async () => {
        render(<Logout />)
        const heading = screen.getByRole('heading', { name: /are you sure/i })
        expect(heading).toBeInTheDocument();
        const yes = screen.getByRole('button', { name: /yes/i });
        expect(yes).toBeInTheDocument();
    });


    test('logout user correctly', async () => {
        window.localStorage.setItem("jwt", "token");
        const { user } = render(<Logout />);

        const yes = screen.getByRole('button', { name: /yes/i });
        await user.click(yes);

        await waitFor(() => expect(window.location.assign).toHaveBeenCalledWith('/'));
    });

    test('logout user fails', async () => {
        const jsdomAlert = window.alert;
        window.alert = () => { return true };
        const { user } = render(<Logout />);

        const yes = screen.getByRole('button', { name: /yes/i });
        await user.click(yes);

        expect(window.location.assign).not.toHaveBeenCalled();
        window.confirm = jsdomAlert;
    });
});
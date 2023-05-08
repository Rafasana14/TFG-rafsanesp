import AppNavbar from "./AppNavbar";
import { render, screen } from "./test-utils";

describe('AppNavbar', () => {

    test('renders public links correctly', () => {
        render(<AppNavbar />);
        const linkDocsElement = screen.getByRole('link', { name: 'Docs' });
        expect(linkDocsElement).toBeInTheDocument();

        const linkPlansElement = screen.getByRole('link', { name: 'Pricing Plans' });
        expect(linkPlansElement).toBeInTheDocument();

        const linkHomeElement = screen.getByRole('link', { name: 'logo PetClinic' });
        expect(linkHomeElement).toBeInTheDocument();
    });

    test('renders not user links correctly', () => {
        render(<AppNavbar />);
        const linkDocsElement = screen.getByRole('link', { name: 'Register' });
        expect(linkDocsElement).toBeInTheDocument();

        const linkPlansElement = screen.getByRole('link', { name: 'Login' });
        expect(linkPlansElement).toBeInTheDocument();
    });

    // test('renders admin links correctly', () => {
    //     jest.spyOn('./services/token.service.js', 'getLocalAccessToken').mockReturnValue("jwt");
    //     render(<AppNavbar />);

    //     const linkDocsElement = screen.getByRole('link', { name: 'Dashboard' });
    //     expect(linkDocsElement).toBeInTheDocument();

    //     const linkPlansElement = screen.getByRole('link', { name: 'Owners' });
    //     expect(linkPlansElement).toBeInTheDocument();
    // });

});

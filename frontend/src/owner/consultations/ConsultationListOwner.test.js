import { render, screen, testRenderList } from "../../test-utils";
import ConsultationListOwner from "./ConsultationListOwner";

describe('ConsultationListOwner', () => {
    test('renders correctly', async () => {
        render(<ConsultationListOwner />);
        testRenderList(/consultations/i);

        const filterButtons = screen.getAllByRole('button', { 'name': /filter/ });
        expect(filterButtons).toHaveLength(4);

        const searchBar = screen.getByRole('searchbox', { 'name': 'search' });
        expect(searchBar).toBeInTheDocument();

        const clearButton = screen.getByRole('button', { 'name': 'clear-all' });
        expect(clearButton).toBeInTheDocument();
    });

    test('renders consultations correctly', async () => {
        render(<ConsultationListOwner />);
        const consultation1 = await screen.findByRole('cell', { 'name': 'Mi gato no come' });
        expect(consultation1).toBeInTheDocument();

        const consultation1Status = await screen.findByRole('cell', { 'name': 'ANSWERED' });
        expect(consultation1Status).toBeInTheDocument();

        const consultation2Status = await screen.findByRole('cell', { 'name': 'PENDING' });
        expect(consultation2Status).toBeInTheDocument();

        const editButtons = await screen.findAllByRole('link', { 'name': /edit/ });
        expect(editButtons).toHaveLength(2);

        const consultations = await screen.findAllByRole('row', {},);
        expect(consultations).toHaveLength(3);
    });

    test('filter consultation correct', async () => {
        const { user } = render(<ConsultationListOwner />);

        const pendingFilter = await screen.findByRole('button', { 'name': 'pending-filter' });
        await user.click(pendingFilter);

        const consultation2Status = await screen.findByRole('cell', { 'name': 'PENDING' });
        expect(consultation2Status).toBeInTheDocument();

        const consultation1Status = screen.queryByRole('cell', { 'name': 'ANSWERED' });
        expect(consultation1Status).not.toBeInTheDocument();
    });

    test('search consultation correct', async () => {
        const { user } = render(<ConsultationListOwner />);

        const searchbar = await screen.findByRole('searchbox', { 'name': 'search' });
        await user.type(searchbar, "leo");

        const consultationOwner1 = await screen.findByRole('cell', { 'name': /leo/i });
        expect(consultationOwner1).toBeInTheDocument();

        const consultationOwner2 = screen.queryByRole('cell', { 'name': /basil/i });
        expect(consultationOwner2).not.toBeInTheDocument();
    });

    test('clear all correct', async () => {
        const { user } = render(<ConsultationListOwner />);

        const pendingFilter = await screen.findByRole('button', { 'name': 'pending-filter' });
        await user.click(pendingFilter);
        const searchbar = await screen.findByRole('searchbox', { 'name': 'search' });
        await user.type(searchbar, "owner2");
        const clearAllButton = await screen.findByRole('button', { 'name': 'clear-all' });
        await user.click(clearAllButton);

        const consultationOwner1 = await screen.findByRole('cell', { 'name': /leo/i });
        expect(consultationOwner1).toBeInTheDocument();

        const consultationOwner2 = await screen.findByRole('cell', { 'name': /basil/i });
        expect(consultationOwner2).toBeInTheDocument();
    });

    test('filter and search not found', async () => {
        const { user } = render(<ConsultationListOwner />);

        const pendingFilter = await screen.findByRole('button', { 'name': 'pending-filter' });
        await user.click(pendingFilter);
        const searchbar = await screen.findByRole('searchbox', { 'name': 'search' });
        await user.type(searchbar, "owner1");

        const consultationOwner1 = screen.queryByRole('cell', { 'name': /leo/i });
        expect(consultationOwner1).not.toBeInTheDocument();

        const consultationOwner2 = screen.queryByRole('cell', { 'name': /basil/i });
        expect(consultationOwner2).not.toBeInTheDocument();

        const cell = await screen.findByRole('cell', { 'name': /There are no consultations/ });
        expect(cell).toBeInTheDocument();
    });

    test('filter then search', async () => {
        const { user } = render(<ConsultationListOwner />);

        const pendingFilter = await screen.findByRole('button', { 'name': 'pending-filter' });
        await user.click(pendingFilter);
        const searchbar = await screen.findByRole('searchbox', { 'name': 'search' });
        await user.type(searchbar, "bas");

        const consultationOwner1 = await screen.findByRole('cell', { 'name': /basil/i });
        expect(consultationOwner1).toBeInTheDocument();

        const consultationOwner2 = screen.queryByRole('cell', { 'name': /leo/i });
        expect(consultationOwner2).not.toBeInTheDocument();
    });

    test('search then filter', async () => {
        const { user } = render(<ConsultationListOwner />);

        const searchbar = await screen.findByRole('searchbox', { 'name': 'search' });
        await user.type(searchbar, "bas");
        const pendingFilter = await screen.findByRole('button', { 'name': 'pending-filter' });
        await user.click(pendingFilter);

        const consultationOwner1 = await screen.findByRole('cell', { 'name': /basil/i });
        expect(consultationOwner1).toBeInTheDocument();

        const consultationOwner2 = screen.queryByRole('cell', { 'name': /leo/i });
        expect(consultationOwner2).not.toBeInTheDocument();
    });

    test('search and filter then remove search', async () => {
        const { user } = render(<ConsultationListOwner />);

        const searchbar = await screen.findByRole('searchbox', { 'name': 'search' });
        await user.type(searchbar, "bas");
        const pendingFilter = await screen.findByRole('button', { 'name': 'pending-filter' });
        await user.click(pendingFilter);
        await user.clear(searchbar);

        const consultationStatusPending = await screen.findByRole('cell', { 'name': 'PENDING' });
        expect(consultationStatusPending).toBeInTheDocument();
    });

    test('search and filter then remove filter', async () => {
        const { user } = render(<ConsultationListOwner />);

        const searchbar = await screen.findByRole('searchbox', { 'name': 'search' });
        await user.type(searchbar, "bas");
        const pendingFilter = await screen.findByRole('button', { 'name': 'pending-filter' });
        await user.click(pendingFilter);
        const allFilter = await screen.findByRole('button', { 'name': 'all-filter' });
        await user.click(allFilter);

        const consultationOwner2 = await screen.findByRole('cell', { 'name': /basil/i });
        expect(consultationOwner2).toBeInTheDocument();

        const consultationOwner1 = screen.queryByRole('cell', { 'name': /leo/i });
        expect(consultationOwner1).not.toBeInTheDocument();
    });

    test('search then remove search', async () => {
        const { user } = render(<ConsultationListOwner />);

        const searchbar = await screen.findByRole('searchbox', { 'name': 'search' });
        await user.type(searchbar, "bas");
        await user.clear(searchbar);

        const consultationOwner2 = await screen.findByRole('cell', { 'name': /basil/i });
        expect(consultationOwner2).toBeInTheDocument();

        const consultationOwner1 = await screen.findByRole('cell', { 'name': /leo/i });
        expect(consultationOwner1).toBeInTheDocument();
    });

    test('filter then remove filter', async () => {
        const { user } = render(<ConsultationListOwner />);

        const pendingFilter = await screen.findByRole('button', { 'name': 'pending-filter' });
        await user.click(pendingFilter);
        const allFilter = await screen.findByRole('button', { 'name': 'all-filter' });
        await user.click(allFilter);

        const consultationOwner2 = await screen.findByRole('cell', { 'name': /basil/i });
        expect(consultationOwner2).toBeInTheDocument();

        const consultationOwner1 = await screen.findByRole('cell', { 'name': /leo/i });
        expect(consultationOwner1).toBeInTheDocument();
    });
});
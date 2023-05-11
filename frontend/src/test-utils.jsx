import { fireEvent, render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import userEvent from "@testing-library/user-event";

// const customRender = (ui, options) =>
//     render(ui, { wrapper: BrowserRouter, ...options })

const customRender = (ui, { route = '/' } = {}) => {
    window.history.pushState({}, 'Test page', route)

    return {
        user: userEvent.setup(),
        ...render(ui, { wrapper: BrowserRouter }),
    }
}

// const renderWithMemory = (ui, options) =>
//     render(ui, { wrapper: MemoryRouter, ...options })

const testRenderList = (title) => {
    const heading = screen.getByRole('heading', { 'name': title });
    expect(heading).toBeInTheDocument();

    const table = screen.getByRole('table', { 'name': title });
    expect(table).toBeInTheDocument();

    const addLink = screen.getByRole('link', { 'name': /Add/ });
    expect(addLink).toBeInTheDocument();

    const rows = screen.getAllByRole('row');
    expect(rows).toHaveLength(1);

}

const testRenderForm = (title, form) => {

    const heading = screen.getByRole('heading', { 'name': title });
    expect(heading).toBeInTheDocument();

    form.forEach(i => {
        let input;
        if (i[1] === "label") input = screen.getByLabelText(i[0]);
        else input = screen.getByRole(i[1], { 'name': i[0] });
        expect(input).toBeInTheDocument();
    });
}

const testFilledEditForm = async (form) => {
    form.forEach(async (i) => {
        const input = await screen.findByRole(i[1], { 'name': i[0] });
        if (i.length === 4) expect(input).toBeDisabled();
        else expect(input).toHaveValue();
    });
}

async function checkOption(option) {
    expect(await screen.findByRole('option', { name: option })).toBeInTheDocument();
}

async function fillForm(user, form) {
    form.forEach(i => {
        if (i.length === 3) {
            if (i[1] === "label") {
                const input = screen.getByLabelText(i[0]);
                fireEvent.change(input, { target: { value: i[2] } })
            }
            else {
                const input = screen.getByRole(i[1], { 'name': i[0] });
                if (i[1] === "textbox") {
                    fireEvent.change(input, { target: { value: i[2] } })
                } else if (i[1] === "combobox") {
                    user.selectOptions(input, i[2]);
                }
            }
        }
    });
}

// re-export everything
export * from '@testing-library/react'

// override render method
export { customRender as render, testRenderList, testRenderForm, fillForm, testFilledEditForm, checkOption }
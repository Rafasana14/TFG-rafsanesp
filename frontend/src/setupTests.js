// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
import { server } from './mocks/server';
import 'jest-canvas-mock';
// Establish API mocking before all tests.
global.IS_REACT_ACT_ENVIRONMENT = true;
jest.mock('react-chartjs-2', () => ({
    Bar: () => <img aria-label='bar' />,
    Pie: () => <img aria-label='pie' />,
}));

beforeAll(() => {
    server.listen();
    jest.setTimeout(15000);
})

// Reset any request handlers that we may add during the tests,
// so they don't affect other tests.
afterEach(() => server.resetHandlers())

// Clean up after the tests are finished.
afterAll(() => server.close())

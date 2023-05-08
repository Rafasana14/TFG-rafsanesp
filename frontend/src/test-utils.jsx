import { render } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'

const customRender = (ui, options) =>
    render(ui, { wrapper: BrowserRouter, ...options })

// re-export everything
export * from '@testing-library/react'

// override render method
export { customRender as render }
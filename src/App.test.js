import { render, screen } from '@testing-library/react';
import App from './App';


/*
* This test checks if the chart title is rendered. 
* The getByText function searches the entire rendered DOM for an element 
* that matches the given text.
*/
test('renders Covid-19 Daily Cases chart title', () => {
    render(<App />);
    const chartTitle = screen.getByText(/Covid-19 Dashboard for Worldwide/i);
    expect(chartTitle).toBeInTheDocument();
});


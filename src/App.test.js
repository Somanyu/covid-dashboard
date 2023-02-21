import { render, screen, act } from '@testing-library/react';
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



test('renders data from API', async () => {
    const mockData = {
        cases: 678801612,
        deaths: 6791786,
        recovered: 651560209
    };
    jest.spyOn(global, 'fetch').mockImplementation(() =>
        Promise.resolve({
            json: () => Promise.resolve(mockData),
        })
    );

    render(<App />);

    await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 0)); // Wait for state update
    });

    expect(await screen.findByText(/Cases for Worldwide 678801612/i)).toBeInTheDocument();
    expect(await screen.findByText(/Deaths for Worldwide 6791786/i)).toBeInTheDocument();
    expect(await screen.findByText(/Recovered for Worldwide 651560209/i)).toBeInTheDocument();

    global.fetch.mockRestore();
});



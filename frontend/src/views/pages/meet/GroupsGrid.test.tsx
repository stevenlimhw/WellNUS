import React from 'react';
import { rest } from "msw";
import { setupServer } from "msw/node";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import GroupsGrid from './GroupsGrid';
import { BrowserRouter } from 'react-router-dom';

// Mock API Data

const groupsData = [
    {
        id: 1,
        group_name: "Group A",
        group_description: "Group Description A",
        category: "SUPPORT"
    },
    {
        id: 2,
        group_name: "Group B",
        group_description: "Group Description B",
        category: "SUPPORT"
    },
    {
        id: 3,
        group_name: "Group C",
        group_description: "Group Description C",
        category: "COUNSEL"
    }
];

// Mock API Server

const server = setupServer(
    rest.get("http://localhost:8080/group", (req, res, ctx) => {
        return res(ctx.json(groupsData))
    })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// Tests

test("GroupsGrid: Gets the correct group details.", async () => {
    render(<GroupsGrid />, {wrapper: BrowserRouter});
    const names = await waitFor(() => screen.getAllByRole("group_name"));
    const descriptions = await waitFor(() => screen.getAllByRole("group_description"));
    const categories = await waitFor(() => screen.getAllByRole("group_category"));
    for (let i = 0; i < groupsData.length; i++) {
        expect(names[i]).toHaveTextContent(groupsData[i].group_name);
        expect(descriptions[i]).toHaveTextContent(groupsData[i].group_description);
        expect(categories[i]).toHaveTextContent(groupsData[i].category);
    }
});
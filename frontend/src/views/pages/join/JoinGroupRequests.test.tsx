import React from 'react';
import { rest } from "msw";
import { setupServer } from "msw/node";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from 'react-router-dom';
import JoinGroupRequests from './JoinGroupRequests';

// Mock API Data

const details = {
    id: 1,
    email: "test@u.nus.edu"
}

const requests = [
    {
        group: {
            category: "COUNSEL",
            group_description: "Welcome to your new Counsel Room",
            group_name: "Counsel Room",
            id: 1,
            owner_id: 1
        },
        join_request: {
            group_id: 1,
            id: 1,
            user_id: 3
        },
        user: {
            email: "granger@u.nus.edu",
            faculty: "CHS",
            first_name: "Hermione",
            gender: "F",
            id: 3,
            last_name: "Granger",
            password: "",
            password_hash: "$argon2id$v=19$m=65536,t=1,p=2$7x+Roa3S61nnSujibk5QUg$6eXdJEvqfN22lxbM+cHIfQDrjg+LelOYoHotSzvbtHQ",
            user_role: "MEMBER"
        }
    }
];

// Tests

test("JoinGroupRequests: Gets the correct requests.", async () => {
    render(<JoinGroupRequests details={details} requests={requests} />, {wrapper: BrowserRouter});
    const requestIDs = await waitFor(() => screen.getAllByRole("request_id"));
    const requestApplicants = await waitFor(() => screen.getAllByRole("request_applicant"));
    const requestgroupWithIDs = await waitFor(() => screen.getAllByRole("request_groupWithID"));

    for (let i = 0; i < requests.length; i++) {
        expect(requestIDs[i]).toHaveTextContent((requests[i].join_request.id).toString());
        expect(requestApplicants[i]).toHaveTextContent(requests[i].user.first_name);
        expect(requestgroupWithIDs[i]).toHaveTextContent(requests[i].group.group_name + "#" + requests[i].join_request.group_id);
    }
});
export const getRequestOptions = {
    method: 'GET',
    credentials: 'include' as RequestCredentials,
    mode: 'cors' as RequestMode
}

export const postRequestOptions = {
    method: 'POST',
    credentials: 'include' as RequestCredentials,
    mode: 'cors' as RequestMode
}

export const deleteRequestOptions = {
    method: 'DELETE',
    credentials: 'include' as RequestCredentials,
    mode: 'cors' as RequestMode
}

export const patchRequestOptions = {
    method: 'PATCH',
    credentials: 'include' as RequestCredentials,
    mode: 'cors' as RequestMode
}

export const abortableGetRequestOptions = (signal: AbortSignal) => ({
    ...getRequestOptions,
    signal
})

export const abortablePostRequestOptions = (signal: AbortSignal) => ({
    ...postRequestOptions,
    signal
})

export const abortableDeleteRequestOptions = (signal: AbortSignal) => ({
    ...deleteRequestOptions,
    signal
})

export const abortablePatchRequestOptions = (signal: AbortSignal) => ({
    ...patchRequestOptions,
    signal
})
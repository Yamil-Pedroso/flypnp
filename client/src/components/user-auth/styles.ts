import styled from 'styled-components';

export const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.625rem;
    padding: 1.25rem;
    width: 100%;
    max-width: 31.25rem;

    border: 1px solid #e5e5e5;
    border-radius: 0.625rem;
    background-color: #fff;
    position: absolute;


    h1 {
        margin-bottom: 1.25rem;
    }

    .form-wrapper {
        display: flex;
        flex-direction: column;
        gap: 0.625rem;
        width: 100%;
    }

    .form-wrapper .or-wrapper p {
        margin: 0 auto;
    }

    form {
        display: flex;
        flex-direction: column;
        gap: 0.625rem;
        width: 100%;
    }

    input {
        padding: 0.625rem;
        border-radius: 0.3125rem;
        border: 1px solid #e5e5e5;
        width: 100%;
    }

    button {
        padding: 0.625rem;
        border-radius: 0.3125rem;
        border: none;
        background-color: #000;
        color: #fff;
        cursor: pointer;
    }

    .or-wrapper {
        display: flex;
        align-items: center;
        gap: 0.625rem;
        margin: 1.25rem 0;
    }

    .google-wrapper {
        display: flex;
        justify-content: center;
    }

    .question-btn-wrapper {
        display: flex;
        justify-content: center;
        gap: 5px;
        margin-top: 1.25rem;

        a {
            color: #000;
            text-decoration: underline;
        }
    }
`;

{/* Register Form */}

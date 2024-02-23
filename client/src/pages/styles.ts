import styled from "styled-components";

export const NotificationsContainer = styled.div`
    display: flex;
    flex-direction: column;

    width: 100%;
    height: 50rem;
    margin: 0 auto;
    border-top: 1px solid #e0e0e0;

    h1 {
        font-weight: 500;
        color: #434343;
        margin-top: 1.6rem;
        margin-left: 3.5rem;
    }

    .notis-wrapper {
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
        margin-top: 2rem;
        gap: 1rem;

        .notis-cont {
            display: flex;
            align-items: center;
            width: 20rem;
            height: 6rem;
            padding: 1rem 1rem 1rem 1.5rem;
            background-color: #fff;
            border: 3px solid #8b2e3f;
            border-radius: 1rem;
            box-shadow: 3px 3px 0rem 1px #8b2e3f;
            cursor: pointer;
            position: relative;

            .close-icon {
                position: absolute;
                top: 0.7rem;
                right: 0.7rem;
                color: #515151;
                cursor: pointer;

            }

            p {
                font-size: 1.2rem;
                color: #515151;
                width: 15rem;
            }
        }
    }
`;

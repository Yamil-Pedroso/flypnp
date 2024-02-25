import styled from "styled-components";

export const TripsContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1rem;
  border-top: 1px solid #e0e0e0;

    .trips-wrapper {
        display: flex;
        flex-direction: column;
        padding: 0rem 20rem;
        gap: .6rem;

        h1 {
            font-weight: 500;
            color: #434343;
        }

        p {
            font-size: 1.1rem;
            color: #434343;
            font-weight: 100;
        }

        button {
            padding: .8rem 1.5rem;
            margin-top: 1rem;
            border: none;
            border-radius: 5px;
            background-color: #ff385c;
            color: white;
            font-size: 1.1rem;
            font-weight: 500;
            cursor: pointer;
            transition: all .3s ease;

            a {
                text-decoration: none;
                color: white;
            }

            &:hover {
                background-color: #ff1e43;
            }
        }
    }

`;

import styled from "styled-components";

export const NotificationsContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 80rem;
    height: 50rem;
    margin: 0 auto;
    
    .notis-wrapper {
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
        margin-top: 2rem;
        gap: 1rem;
        
        .notis-cont {
            width: 12rem;
            height: 14rem;
            padding: 1rem;
            background-color: #a7e7c2;
            border: 1px solid #e0e0e0;
            border-radius: 5px;
            cursor: pointer;
        }
    }
`;
import styled from "styled-components";

export const AddGuestsContainer = styled.div`
    width: 22rem;
    height: 100%;
    background-color: #fff;
    color: #2a2a2a;
    display: flex;
    align-items: center;
    border-radius: 3rem;

    .add-guests-wrapper {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: relative;

      &:hover {
        background-color: #dbdbdb;
        border-radius: 3rem;
        height: 100%;
        cursor: pointer;
      }

      .header-guests {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        background-color: #424242;
        color: #fff;
        border-radius: 3rem;
        box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);

        p {
          margin-left: 1.6rem;
        }

        p:first-child {
        font-size: 0.9rem;
      }

        p:last-child {
          color: #909090;
          font-size: 1rem;

        }
      }

      .header-guests-two {

        p {
          margin-left: 1.6rem;
        }

        p:first-child {
        font-size: 0.9rem;
      }

        p:last-child {
          color: #909090;
          font-size: 1rem;

        }
        }

      }

`;

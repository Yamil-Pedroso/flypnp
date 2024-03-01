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

      .guests-dropdown {
        width: 27rem;
        height: auto;
        display: flex;
        flex-direction: column;
        position: absolute;
        top: 5rem;
        right: 0rem;
        background-color: #fff;
        border-radius: 1.5rem;
        box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
        padding: 1.5rem 3rem 0rem 2rem;
        //display: none;
        z-index: 1000;

        &.show {
          display: block;
        }

        p {
          font-size: 1.2rem;
        }

        .section {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 1rem;
          border-bottom: 1px solid #e0e0e0;
          padding-bottom: 1.5rem;

          .counter {
            display: flex;
            align-items: center;

            span {
              margin: 0 1rem;
              font-size: 1.2rem;
              color: #909090;
            }

            .counter-icon {
              font-size: 1.5rem;
              color: #909090;
              cursor: pointer;
            }

            .counter-icon.disabled {
              color: #e0e0e0;
              cursor: not-allowed;

              &:hover {
                color: #909090;
                cursor: not-allowed;
              }
            }
          }

          .guest {
            p {
              font-size: 1.2rem;
              padding-bottom: 0.5rem;
            }

            span, a {
              color: #909090;
              font-size: 1rem;
            }
          }
        }
      }
`;

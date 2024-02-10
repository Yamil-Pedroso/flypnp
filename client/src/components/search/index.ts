import styled, { keyframes } from 'styled-components';

const growWrapperIcon = keyframes`
  from {
    width: 3.6rem;
  }
  to {
    width: 7rem;
  }
`;

export const SearchContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 55rem;
  height: 4.5rem;
  margin: 2rem 0;
  border-radius: 10rem;
  background-color: #fff;
  border: 0.1rem solid #e5e5e5;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
  overflow: hidden;

  .search-dest-container {
    width: 22rem;
    height: 100%;
    background-color: #fff;
    display: flex;
    align-items: center;
    overflow: hidden;

    .search-dest-menu-box {
        width: 32rem;
        height: 30rem;
        background-color: #fff;
        position: absolute;
        top: 13.5rem;
        z-index: 2;
        border-radius: 2rem;
        box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
        overflow: hidden;

        p:first-child {
          padding: 2.8rem 3rem 0 1.2rem;
          margin-left: 1.2rem;
          font-size: .8rem;
          font-weight: bold;
          color: #545454;
        }
        .search-dest-menu-wrapper {
          margin-top: 2.3rem;
          display: flex;
          justify-content: center;
          align-items: center;
          flex-wrap: wrap;


          .search-dest-menu-item {
                display: flex;
                justify-content: center;
                flex-direction: column;
                padding-bottom: 1.5rem;
            }

            .search-dest-menu-item p {
              margin-top: .3rem;
              margin-left: 1rem;
              font-size: .9rem;
              color: #909090
            }

            .search-dest-menu-item img {
              width: 8.5rem;
              height: 8.3rem;
              border-radius: .9rem;
              margin: 0 .5rem;
              border: 0.05rem solid #d1d1d1;
            }
        }
      }

    &:hover {
      background-color: #dbdbdb;
      border-top-right-radius: 3rem;
      border-bottom-right-radius: 3rem;
      cursor: pointer;

    }

    .search-dest-wrapper {
      width: 100%;
      height: 100%;
      background-color: #fff;
      border-top-right-radius: 3rem;
      border-bottom-right-radius: 3rem;
    }

    .default-search-dest-wrapper {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      margin-left: 1.6rem;
      color: #2a2a2a;
      font-size: 1rem;

      p {
        padding: 0.1rem;
      }

      p:first-child {
        font-size: 0.9rem;
      }

      p:last-child {
        color: #909090;
      }
    }

    .input-wrapper {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      margin-left: 1.6rem;

       label, input {
        padding: 0.1rem;
      }

      label {
        font-size: .9rem;
        color: #2e2e2e;
      }

      input {
        width: 16rem;
        border: none;
        outline: none;
        border-radius: 0.3rem;
      }

      input::placeholder {
        font-size: 1rem;
        color: #909090;

      }
      input[type='text'] {
        font-size: 1rem;
        color: #909090;
      }
    }
  }

  .check-in-out-container {
    width: 25rem;
    height: 100%;
    font-size: .8rem;

       .check-date {
        width: 100%;
        margin-left: 1.6rem;
        display: flex;
        flex-direction: column;
        justify-content: center;
        margin: 0;

          p {
            margin-left: 1.6rem;

        }

          &:hover {
            width: 100%;
            height: 100%;
            background-color: #dbdbdb;
            border-radius: 5rem;
            cursor: pointer;
          }
       }

       .check-date p:last-child {
        color: #909090;
        font-size: 1rem;
       }

       .check-in {
          width: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;

        p {
          margin-left: 1.6rem;

        }

         &:hover {
          width: 100%;
          height: 100%;
          background-color: #dbdbdb;
          border-radius: 5rem;
          cursor: pointer;
         }
       }

       .check-in p:last-child {
        color: #909090;
        font-size: 1rem;
        }

        .check-out {
          width: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;

          p {
          margin-left: 1.6rem;

        }
          &:hover {
            width: 100%;
            height: 100%;
            background-color: #dbdbdb;
            border-radius: 3rem;
            cursor: pointer;
          }
        }

        .check-out p:last-child {
          color: #909090;
          font-size: 1rem;

        }

      .check-in-out {
          width: 25rem;
          display: flex;
          justify-content: space-around;
          align-items: center;
          width: 100%;
          height: 100%;
          background-color: #fff;
          color: #2a2a2a;
      }

      .check-in-out-divider {
        width: 0.1rem;
        height: 2.4rem;
        background-color: #dbdbdb;
      }
  }

  .add-guests-container {
    width: 22rem;
    height: 100%;
    background-color: #fff;
    color: #2a2a2a;
    display: flex;
    align-items: center;

    .add-guests-wrapper {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .header-guests {
        margin-left: .8rem;
        font-size: .8rem;
      }

      .search-guests-wrapper {
        width: 3.6rem;
        height: 3.6rem;
        border-radius: 50%;
        background-color: #0baa4e;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-right: .8rem;
        transition: all 0.3s;

        p {
          display: none;
        }

        .search-icon {
          font-size: 1.3rem;
          color: #fff;
        }

        .bg-icon-color {
          background-color: #0a8d3d;
        }
      }

      .search-guests-wrapper-redy {
        animation: ${growWrapperIcon} 0.5s;
        width: 7rem;
        background-color: #0baa4e;
        border-radius: 3rem;

        p {
          display: block;
          margin-left: .5rem;
          font-size: 1rem;
          color: #fff;
        }
      }
    }
  }
`;

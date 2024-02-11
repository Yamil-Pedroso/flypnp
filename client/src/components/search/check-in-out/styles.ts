import styled from "styled-components";

export const CheckInOutContainer = styled.div`
    width: 25rem;
    height: 100%;
    font-size: .8rem;
    position: relative;

    .test-check-menu {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 55rem;
      height: 35rem;
      background-color: #fff;
      box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
      border-radius: 3rem;
      top: 5rem;
      right: -17.5rem;
      position: absolute;
      z-index: 999;
    }

    .check-in-out-wrapper {
          width: 25rem;
          display: flex;
          justify-content: space-around;
          align-items: center;
          width: 100%;
          height: 100%;
          background-color: #fff;
          color: #2a2a2a;


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

       .check-in-two {
         width: 100%;
         height: 100%;
         display: flex;
         flex-direction: column;
         justify-content: center;

         &:hover {
          width: 100%;
          height: 100%;
          background-color: #dbdbdb;
          border-radius: 5rem;
          cursor: pointer;
         }


          p {
            margin-left: 1.6rem;
          }

          p:last-child {
            color: #909090;
            font-size: 1rem;
          }

       }
       .check-in {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          border-radius: 5rem;
          background-color: #424242;
          color: #fff;
          box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
          cursor: pointer;
        p {
          margin-left: 1.6rem;

        }

       }

       .check-in p:last-child {
        color: #909090;
        font-size: 1rem;
        }

        .check-out {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          border-radius: 5rem;
          background-color: #424242;
          color: #fff;
          box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
          cursor: pointer;
        p {
          margin-left: 1.6rem;

        }

        p:last-child {
          color: #909090;
          font-size: 1rem;
        }

       }

       .check-out-two {
         width: 100%;
         height: 100%;
         display: flex;
         flex-direction: column;
         justify-content: center;

         &:hover {
          width: 100%;
          height: 100%;
          background-color: #dbdbdb;
          border-radius: 5rem;
          cursor: pointer;
         }


          p {
            margin-left: 1.6rem;
          }

          p:last-child {
            color: #909090;
            font-size: 1rem;
          }

       }

      .check-in-out-divider {
        width: 0.1rem;
        height: 2.4rem;
        background-color: #dbdbdb;
      }
    }
`;

import styled from 'styled-components';

export const SearchDestinationContainer = styled.div`
    width: 22rem;
    height: 100%;
    background-color: #fff;
    display: flex;
    align-items: center;
    border-radius: 3rem;
    position: relative;

    .search-dest-menu-box {
        width: 32rem;
        height: 30rem;
        background-color: #fff;
        top: 5rem;
        border-radius: 2rem;
        box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
        overflow: hidden;
        position: absolute;
        z-index: 2;

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

    .search-dest-wrapper {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: relative;

      &:hover {
        background-color: #dbdbdb;
        border-radius: 3rem;
        width: 100%;
        height: 100%;
        cursor: pointer;
      }

      .default-search-dest-wrapper {
        p {
        margin-left: 1.6rem;
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
      background-color: #424242;
      border-radius: 3rem;
      box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
      display: flex;
      flex-direction: column;
      justify-content: center;

       label, input {
        padding: 0.1rem;
        margin-left: 1.6rem;
        mouse-events: none;
      }

      label {
        font-size: .9rem;
        color: #fff;
      }

      input {
        width: 12rem;
        border: none;
        outline: none;
        border-radius: 0.3rem;
        background-color: #424242;
      }

      input::placeholder {
        font-size: 1rem;
        color: #909090;

      }
      input[type='text'] {
        font-size: 1rem;
        color: #e4e4e4;
      }
    }


  }
`;

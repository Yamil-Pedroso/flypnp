import styled from 'styled-components';

export const CreateWishListContainer = styled.div`
  margin: 20rem auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 40rem;
  height: 20rem;
  padding: .5rem;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  background-color: #fff;

  .header-wrapper {
    display: flex;
    align-items: center;
    width: 100%;
    padding: 1rem;
    border-bottom: 1px solid #e0e0e0;

    h1 {
      font-size: 1.5rem;
      font-weight: 300;
      margin-left: 1rem;
    }
  }

    .close-icon {
        cursor: pointer;

    }

  .input-wrapper {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

     .limit-chars {
      color: #2a2a2a;

      span {
        color: inherit;
      }
    }

   }

    input[type='text'] {
      font-size: 1.2rem;
      color: #626262;
    }

     input {
       width: 90%;
       height: 2.5rem;
       margin: 1.5rem 0;
       padding: 2rem 1rem;
       border: 1px solid #c1c1c1;
       border-radius: 10px;

      &.error {
        border: 2px solid red;
      }

      &:focus {
        outline: none;
        border: 2px solid #4f4f4f;
      }

      &::placeholder {
        color: #949494;
        font-size: 1.2rem;
      }
  }

  .limit-chars {
    display: flex;
    justify-content: flex-start;
    width: 90%;
    margin-top: -1rem;
    margin-left: .3rem;
    color: #999999;

    .error-text-wrapper {
      display: flex;
      align-items: center;
      margin-left: 1rem;
      color: red;

      p {
        font-size: 1rem;
        margin-left: .3rem;
      }
    }

    p {
      font-size: 1rem;
      margin-left: .3rem;
    }

    span {

    }
  }


  .btn-wrapper {
    display: flex;
    justify-content: space-between;
    margin-top: 1.8rem;
    width: 100%;
    border-top: 1px solid #e0e0e0;
    padding: 1.5rem 2rem;

    button {
      width: 30%;
      height: 2.5rem;
      margin-top: 1rem;
      border: none;
      border-radius: 10px;
      font-size: 1.2rem;
      font-weight: 300;
      cursor: pointer;
    }

    .clear-btn {
      background-color: #fff;
      border: 1px solid #c1c1c1;
      color: #2d2d2d;
      transition: all .2s ease-in-out;

      &:hover {
        background-color: #e7e7e7;
        color: #2a2a2a;
      }
    }

    .create-btn {
      background-color: #f94a52;
      color: #fff;

    }
    .disabled {
      background-color: #d6d6d6;
      color: #fff;
    }
  }
`;

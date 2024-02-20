import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem 0;
  width: 100%;
  max-width: 70rem;
  margin: 0 auto;

  .header-details-wrapper {
    width: 69rem;
    display: flex;
    justify-content: space-between;
    padding-bottom: 1rem;
  }

  .share-save-wrapper {
    display: flex;

    div {
      display: flex;
      align-items: center;
      margin-right: 1rem;
      cursor: pointer;

      span {
        margin-left: .5rem;
        text-decoration: underline;
      }
    }
  }

  .img-details-wrapper {
    width: 69rem;
    height: 36.5rem;
    display: flex;
    border-radius: .7rem;
    overflow: hidden;

    .img-wrapper {
      width: 35rem;
      height: 100%;
      overflow: hidden;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    .img-thumbnail-wrapper {
      width: 35rem;
      height: 100%;
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
      gap: .3rem;

      img {
        width: 17rem;
        height: 18.2rem;
        object-fit: cover;
      }
    }
  }

  .desc-reserve-wrapper {
    width: 69rem;   
    display: flex;
    justify-content: space-between;
    padding-top: 1rem;

    .reserve-box-container {
        width: 23rem;
        height: 28rem;
        padding: 1rem;
        border-radius: .5rem;
        border: 2px solid #a2a2a2;
        box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
    }

    .reserve-box-container button {
        padding: 0.5rem 1rem;
        margin: 1rem 0;
        border: none;
        border-radius: 5px;
        background-color: #f1356d;
        color: white;
        cursor: pointer;
        transition: 0.3s;
        
        &:hover {
            background-color: #f1356d;
            opacity: 0.8;
        }

    }
  }

`;



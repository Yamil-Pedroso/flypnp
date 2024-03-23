import styled from 'styled-components';

export const PlaceGalleryContainer = styled.div`
  .place-gallery-wrapper {
    margin-top: -2rem;
    border-top: 1px solid #dddddd;

    @media (max-width: 1500px) {
      button.active {
        color: #f94a51;
        p {
          color: #2a2a2a;
        }
      }

      button.inactive {
        color: #515151;
      }

      .btn-wrapper {
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 1rem 2rem;
        height: 6rem;
        background-color: #ffffff;
        border-radius: .5rem;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      }

      .btn-wrapper.border {
        border: 1px solid #2a2a2a;
      }
  }

  ul {
    display: flex;
    list-style: none;
  }

    li {
        margin-right: 2rem;

        &:hover {
            cursor: pointer;
        }
    }

`;

export const MenuWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 2rem;
  position: relative;

  .underlineIndicator {
    position: absolute;
    bottom: -10px;
    height: 2px;
    width: 0;
    background-color: #2a2a2a;
    transition: all .3s ease;
}

  .icon-places-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  button {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin: 0 1.5rem;

    p {
      margin-top: .4rem;
      font-size: 1rem;
      font-weight: 400;
      color: #939393;
    }
  }

  button.active {
    cursor: pointer;
    color: #2a2a2a;
    border: none;
    transition: all .3s ease;
    background-color: transparent;
  }

  button.inactive {
    cursor: pointer;
    color: #2a2a2a;
    border: none;
    transition: all .3s ease;
    background-color: transparent;
  }

  @media (max-width: 1500px) {
     flex-wrap: wrap;
      .underlineIndicator {
        display: none;
      }
  }
`;

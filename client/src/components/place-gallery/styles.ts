import styled from 'styled-components';

export const PlaceGalleryContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
2323
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
  margin-top: 3.5rem;

  button.active {
    margin: 0 1rem;
    cursor: pointer;
    border: none;
    background-color: #ff8c91;
    color: #1c1413;
    padding: .3rem 1rem;
    border-radius: 15rem;
    transition: all .3s ease;
  }

  button.inactive {
    margin: 0 1rem;
    cursor: pointer;
    border: 2px solid #c3adae;
    color: #c3adae;
    background-color: transparent;
    padding: .3rem 1rem;
    border-radius: 15rem;
    transition: all .3s ease;
  }

  .card-wrapper {
    position: absolute;
    margin-top: 4rem;
  }
`;

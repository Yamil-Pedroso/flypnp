import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 2rem 0;

  .status-pending {
  color: #5d5d95;
}

 .status-confirmed {
  color: green;
 }

 .status-deleted {
    color: red;
  }
`;

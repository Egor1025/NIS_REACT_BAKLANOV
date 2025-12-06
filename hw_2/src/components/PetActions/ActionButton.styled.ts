import styled from 'styled-components'

export const ActionButton = styled.button`
  padding: 8px 12px;
  border-radius: 8px;
  border: none;
  background-color: steelblue;
  color: white;
  font-size: 14px;
  cursor: pointer;

  &:disabled {
    background-color: gray;
    cursor: not-allowed;
  }
`

export const DangerButton = styled(ActionButton)`
  background-color: crimson;
`
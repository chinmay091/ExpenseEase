import styled from 'styled-components/native';
import FlexContainer from '../FlexContainer';

export const Container = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.primary};
  justify-content: space-between;
  padding: 0;
  position: relative;
  z-index: 1
`;

export const UserIconContainer = styled.View`
  margin-right: 10px;
  position: relative;
`;

export const TitleButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: flex-end;
`;

export const Actions = styled(FlexContainer).attrs({ direction: 'row', gap: 24 })`
  flex-grow: 1;
  justify-content: flex-end;
`;

export const DropdownMenu = styled.View`
  position: absolute;
  top: 45px;
  left: 0;
  background-color: white;
  border-radius: 8px;
  shadow-color: black;
  shadow-opacity: 0.1;
  shadow-offset: 0px 4px;
  shadow-radius: 10px;
  elevation: 10;
  width: 150px;
  z-index: 9999;
`;

export const DropdownItem = styled.TouchableOpacity`
  padding: 12px;
  border-bottom-width: 1px;
  border-bottom-color: #e0e0e0;
`;

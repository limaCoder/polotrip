type PendingActionType = 'SELECT_PHOTO' | 'TOGGLE_PHOTO' | 'SELECT_DATE' | 'DESELECT_ALL';

enum PendingActionTypeEnum {
  SELECT_PHOTO = 'SELECT_PHOTO',
  TOGGLE_PHOTO = 'TOGGLE_PHOTO',
  SELECT_DATE = 'SELECT_DATE',
  DESELECT_ALL = 'DESELECT_ALL',
}

enum UnsavedChangesActionEnum {
  SHOW_DIALOG = 'SHOW_DIALOG',
  CLOSE_DIALOG = 'CLOSE_DIALOG',
  CONFIRM_ACTION = 'CONFIRM_ACTION',
}

interface PendingAction {
  type: PendingActionType;
  photoId?: string;
  date?: string | null;
}

interface UnsavedChangesState {
  isDialogOpen: boolean;
  pendingAction: PendingAction | null;
}

type UnsavedChangesAction =
  | { type: UnsavedChangesActionEnum.SHOW_DIALOG; action: PendingAction }
  | { type: UnsavedChangesActionEnum.CLOSE_DIALOG }
  | { type: UnsavedChangesActionEnum.CONFIRM_ACTION };

function unsavedChangesReducer(
  state: UnsavedChangesState,
  action: UnsavedChangesAction,
): UnsavedChangesState {
  switch (action.type) {
    case UnsavedChangesActionEnum.SHOW_DIALOG:
      return {
        isDialogOpen: true,
        pendingAction: action.action,
      };
    case UnsavedChangesActionEnum.CLOSE_DIALOG:
      return {
        isDialogOpen: false,
        pendingAction: null,
      };
    case UnsavedChangesActionEnum.CONFIRM_ACTION:
      return {
        isDialogOpen: false,
        pendingAction: state.pendingAction,
      };
    default:
      return state;
  }
}

export { unsavedChangesReducer, UnsavedChangesActionEnum, PendingActionTypeEnum };

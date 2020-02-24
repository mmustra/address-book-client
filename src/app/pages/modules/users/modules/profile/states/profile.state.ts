import { ImmutableContext } from '@ngxs-labs/immer-adapter';
import { Action, Selector, State, StateContext } from '@ngxs/store';

import { AuthAction } from '../../../../../../auth/states/auth.actions';
import { IUser } from '../../../interfaces/user.interface';
import { ProfileAction } from './profile.actions';

export class ProfileStateModel {
  profile: IUser;
}

const profileInitialState: ProfileStateModel = {
  profile: null
};

@State<ProfileStateModel>({
  name: 'profile',
  defaults: profileInitialState
})
export class ProfileState {
  @Selector()
  static profile(state: ProfileStateModel): IUser {
    return state.profile;
  }

  @Action(ProfileAction.SetProfile)
  @ImmutableContext()
  setProfile(
    { setState }: StateContext<ProfileStateModel>,
    { profile }: ProfileAction.SetProfile
  ): void {
    setState((draft: ProfileStateModel) => {
      draft.profile = profile;

      return draft;
    });
  }

  @Action(AuthAction.Logout)
  @ImmutableContext()
  clearAll({ setState }: StateContext<ProfileStateModel>): void {
    setState(() => profileInitialState);
  }
}

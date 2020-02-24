import { ImmutableContext } from '@ngxs-labs/immer-adapter';
import { Action, Selector, State, StateContext } from '@ngxs/store';

import { AuthAction } from './auth.actions';

export class AuthStateModel {
  token: string;
}

const authInitialState: AuthStateModel = {
  token: ''
};

@State<AuthStateModel>({
  name: 'auth',
  defaults: authInitialState
})
export class AuthState {
  @Selector()
  static token(state: AuthStateModel): string {
    return state.token;
  }
  @Action(AuthAction.Register)
  @ImmutableContext()
  register(
    { setState }: StateContext<AuthStateModel>,
    { payload }: AuthAction.Register
  ): void {
    setState((draft: AuthStateModel) => {
      draft.token = payload.token;

      return draft;
    });
  }

  @Action(AuthAction.Login)
  @ImmutableContext()
  login(
    { setState }: StateContext<AuthStateModel>,
    { payload }: AuthAction.Login
  ): void {
    setState((draft: AuthStateModel) => {
      draft.token = payload.token;

      return draft;
    });
  }

  @Action(AuthAction.Logout)
  @ImmutableContext()
  logout({ setState }: StateContext<AuthStateModel>): void {
    setState(() => authInitialState);
  }
}

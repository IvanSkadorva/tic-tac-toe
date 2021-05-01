import {Subject} from 'rxjs';
export const lobbyUsersRef = {lobbyUsers: []};

export const lobbyUsersSubject = new Subject();

lobbyUsersSubject.subscribe({
  next: v => {
    lobbyUsersRef.lobbyUsers = v;
  },
});

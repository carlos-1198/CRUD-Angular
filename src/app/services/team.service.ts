import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Team } from '../interfaces/team';

@Injectable({
  providedIn: 'root'
})
export class TeamService {
  private teamDb: AngularFireList<Team>;
  constructor(
    private db: AngularFireDatabase
    ) {
      this.teamDb = this.db.list('/teams', ref => ref.orderByChild('name'));
    }
    getPlayers(): Observable<Team[]> {
      return this.teamDb.snapshotChanges().pipe(
        map(changes => {
          return changes.map(c => ({$key: c.payload.key, ...c.payload.val()}));
        })
      );
    }

    addTeam(team: Team) {
      return this.teamDb.push(team);
    }

    deleteTeam(id: string){
      return this.teamDb.remove(id);
    }

    editTeam(newTeamData){
      const $key = newTeamData.$key;
      delete(newTeamData.$key);
      this.db.list('/teams').update($key, newTeamData);
    }
  }


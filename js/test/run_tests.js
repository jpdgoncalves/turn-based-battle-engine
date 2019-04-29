import {Tester} from '../dependencies/tester.js';
import {StatTest} from './battle/base/stat.test.js';
import {ParticipantTest} from './battle/base/participant.test.js';
import {BattleActionTest} from './battle/base/battle_action.test.js';
import {BattleTest} from './battle/base/battle.test.js';

Tester.test(StatTest);
Tester.test(ParticipantTest);
Tester.test(BattleActionTest);
Tester.test(BattleTest);
import {Participant} from '../../../src/battle/base/participant.js';
import {Tester} from '../../../dependencies/tester.js';

/**
 * Class containing the tests to perform for Participant.
 */
class ParticipantTest {

    test() {
        Tester.assertError(this.testBadConstructor);
        Tester.assertFunction(this.testStats);
        Tester.assertFunction(this.testSkills);
        Tester.assertFunction(this.testDamage);
        Tester.assertFunction(this.testReverseDamage);
    }

    testBadConstructor() {
        let bad = new Participant("bad");
    }

    testStats() {
        let participant = new Participant("Test",10,9,8,7,6);
        Tester.assertValue("Test",participant.name,"Test name");
        Tester.assertValue(10,participant.hp.current_value,"Test hp");
        Tester.assertValue(9,participant.energy.current_value, "Test energy");
        Tester.assertValue(8,participant.shield.current_value, "Test shield");
        Tester.assertValue(7,participant.attack.current_value, "Test attack");
        Tester.assertValue(6, participant.speed.current_value, "Test speed");
    }

    testSkills() {
        let participant = new Participant("Test",10,10,10,10,10);
        let skills = [
            {name:"1"},
            {name:"2"}
        ];
        participant.skills = skills;
        Tester.assertValue(true, participant.hasSkill({name:"1"}), "Test has skill");
        Tester.assertValue(false, participant.hasSkill({name:"3"}), "Test has not skill");
    }

    testDamage() {
        let participant = new Participant("test",150,300,300,1,1);

        participant.damage(150);
        Tester.assertValue(150, participant.shield.current_value,"Test shield damage");

        participant.damage(150,true);
        Tester.assertValue(150, participant.energy.current_value,"Test energy damage");

        participant.damage(50,true,true);
        Tester.assertValue(100, participant.hp.current_value, "Test energy damage");

        participant.damage(400);
        Tester.assertValue(0, participant.shield.current_value, "Test zero shield");
        Tester.assertValue(0, participant.energy.current_value, "Test zero energy");
        Tester.assertValue(0, participant.hp.current_value, "Test zero hp");
    }

    testReverseDamage() {
        let participant = new Participant("test",150,300,300,1,1);
        participant.damage(750);
        participant.reverseDamage(750);
        Tester.assertValue(150,participant.hp.current_value, "Test 150 hp");
        Tester.assertValue(300,participant.shield.current_value, "Test 300 shield");
        Tester.assertValue(300, participant.energy.current_value, "Test 300 energy")
    }
}

export {ParticipantTest};
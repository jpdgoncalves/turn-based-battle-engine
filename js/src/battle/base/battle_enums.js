/**
 * Enumeration of battle moments
 * @enum
 */
const BattleMoments = Object.freeze({
    BEGIN : Symbol("begin"),
    END : Symbol("end"),
    BEGIN_TURN : Symbol("begin_turn"),
    END_TURN : Symbol("end_turn"),
    BEGIN_PARTICIPANT_TURN : Symbol("begin_participant_turn"),
    END_PARTICIPANT_TURN : Symbol("end_participant_turn")
});

/**
 * Enumeration of battle results
 * @enum
 */
const BattleResults = Object.freeze({
    UNDECIDED : Symbol("undecided"),
    WIN : Symbol("win"),
    TIE : Symbol("tie"),
    LOSE : Symbol("lose")
});

export {BattleMoments, BattleResults};
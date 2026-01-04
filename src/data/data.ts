import { DrawSteelData } from '../models/rules-data-types';

export const DRAW_STEEL_RULES: DrawSteelData = {
    rules: [
        {
            title: 'Basic',
            kind: 'rule',
            description: 'Basic rules for Draw Steel',
            subRules: [
                {
                    title: 'Characteristic Scores',
                    kind: 'rule',
                    description: 'Your Might, Agility, Reason, Intuition, and Presence are your characteristic scores and measures of mental and physical power.'
                },
                {
                    title: 'Critical Hit',
                    kind: 'rule',
                    description: 'On a natural 19 or 20 on a Strike or ability power roll (using an action), you can immediately take another action.'
                },
                {
                    title: 'Power Roll',
                    kind: 'rule',
                    description: 'Most abilities and all tests require you to roll 2d10 and add a characteristic. Each power roll has three tiers of outcomes: Tier 1 is a result of 11 or lower. Tier 2 is a result of 12-16. Tier 3 is a result of 17 or higher.',
                },
                {
                    title: 'Recovery',
                    kind: 'rule',
                    description: 'You can spend a Recovery to regain Stamina equal to your recovery value. Only heroes have Recoveries'
                },
                {
                    title: 'Respite',
                    kind: 'rule',
                    description: 'An uninterrupted rest for 24 hours in a safe place, at the end of which you regain all your Recoveries and Stamina and your Victories are converted into XP.'
                },
                {
                    title: 'Skill',
                    kind: 'rule',
                    description: 'If you have at least one skill that applies to a test (not an ability roll), you gain a +2 bonus to it.'
                },
                {
                    title: 'Victories',
                    kind: 'rule',
                    description: 'When you successfully overcome challenges such as combat in an adventure, you earn Victories.'
                }
            ]

        },
        {
            title: 'Edges and Banes',
            kind: 'rule',
            description: 'Situational advantages and disadvantages',
            subRules: [
                {
                    title: 'Edge',
                    kind: 'rule',
                    description: 'If you have a situational advantage (edge) on a power roll, the roll gains +2.'
                },
                {
                    title: 'Double Edge',
                    kind: 'rule',
                    description: 'If you have two or more edges, the roll is one tier higher instead.'
                },
                {
                    title: 'Bane',
                    kind: 'rule',
                    description: 'If you have a situational disadvantage (bane) on a power roll, the roll gains -2.'
                },
                {
                    title: 'Double Bane',
                    kind: 'rule',
                    description: 'If you have two or more banes, the roll is one tier lower instead.'
                },
                {
                    title: 'Special Cases',
                    kind: 'rule',
                    description: '* If you have an edge and a bane or a double edge and a double bane, the roll is made normally without any edges or banes.\n*  If you have a double edge and a bane, the roll has one edge.\n* If you have a double bane and an edge, the roll has one bane.'
                },
            ]
        },
        {
            title: 'Hero Tokens',
            kind: 'rule',
            description: 'A shared pool of tokens set out by the Director at the start of each session.',
            subRules: [
                {
                    title: 'Gain Surges',
                    kind: 'rule',
                    description: 'Spend 1 hero token to gain 2 surges.'
                },
                {
                    title: 'Succeed Save',
                    kind: 'rule',
                    description: 'Spend 1 hero token when you fail a saving throw to succeed instead.'
                },
                {
                    title: 'Reroll Test',
                    kind: 'rule',
                    description: 'Spend 1 hero token to reroll a test. You must use the new roll.'
                },
                {
                    title: 'Regain Stamina',
                    kind: 'rule',
                    description: 'Spend 2 hero tokens on your turn or after taking damage to regain Stamina equal to your Recovery value.'
                }
            ]
        },
        {
            title: 'Combat',
            kind: 'rule',
            description: 'Rules related to combat',
            subRules: [
                {
                    title: 'Combat Turn',
                    kind: 'rule',
                    description: 'On your turn, you can take a main action, a move action, and a maneuver. You can turn your action into an additional move or maneuver. Unlimited free maneuvers.',
                },
                {
                    title: 'Triggered Actions',
                    kind: 'rule',
                    description: 'You can take one triggered action per round when the trigger happens. There is no limit to the number of free triggered actions you can take.'
                },
                {
                    title: 'Combat Glossary',
                    kind: 'rule',
                    description: '',
                    subRules: [
                        {
                            title: 'Concealment',
                            kind: 'rule',
                            description: 'Darkness, fog, invisibility magic, and any other effect that fully obscures a creature or object but doesn’t protect their physical form grants that creature or object concealment. Even if you have line of effect to such a target, a creature or object has concealment from you if you can’t see or otherwise observe them. You can target a creature or object with concealment using a strike, provided they aren’t hidden. However, strikes against such targets take a bane.'
                        },
                        {
                            title: 'Cover',
                            kind: 'rule',
                            description: 'When you have line of effect to a creature or object but that target has at least half their form blocked by a solid obstruction such as a tree, wall, or overturned table, the target has cover. You take a bane on damage-dealing abilities used against creatures or objects that have cover from you.'
                        },
                        {
                            title: 'Damage Immunity',
                            kind: 'rule',
                            description: 'Each damage immunity has a type and value. If a creature with damage immunity takes damage of that type, they reduce the damage equal to the value (minimum 0). If a creature reduces incoming damage to 0, they avoid any associated effects with the damage too.'
                        },
                        {
                            title: 'Damage Weakness',
                            kind: 'rule',
                            description: ''
                        },
                        {
                            title: 'Dying',
                            kind: 'rule',
                            description: ''
                        },
                        {
                            title: 'EoT',
                            kind: 'rule',
                            description: ''
                        },
                        {
                            title: 'Flanking',
                            kind: 'rule',
                            description: ''
                        },
                        {
                            title: 'High Ground',
                            kind: 'rule',
                            description: ''
                        },
                        {
                            title: 'Line of Effect',
                            kind: 'rule',
                            description: ''
                        },
                        {
                            title: 'Opportunity Attack',
                            kind: 'rule',
                            description: ''
                        },
                        {
                            title: 'Potency',
                            kind: 'rule',
                            description: ''
                        },
                        {
                            title: 'Saving Throws',
                            kind: 'rule',
                            description: ''
                        },
                        {
                            title: 'Stamina',
                            kind: 'rule',
                            description: ''
                        },
                        {
                            title: 'Surges',
                            kind: 'rule',
                            description: ''
                        },
                        {
                            title: 'Winded',
                            kind: 'rule',
                            description: ''
                        }
                    ]
                }
            ]
        },
        {
            title: 'Size and Space',
            kind: 'rule',
            description: 'How to interact/think about size in Draw Steel',
            subRules: [
                {
                    title: 'Basics',
                    kind: 'rule',
                    description: 'A creature’s size indicates how many squares they occupy during combat, which defines the creature’s space. If a creature’s size is 1, they occupy a space of 1 square. If a creature is larger than 1 square, their size equals the number of squares they take up in length, width, and height.\n\nIf a creature is a size 1, their size value includes the letter T, S, M, or L, abbreviations of tiny, small, medium, and large respectively. Since the minimal amount of space a creature can take up during combat is 1, this letter indicates the difference between tiny pixies, small polders, medium humans, and large bugbears, each of which occupy of a space 1 square in combat. These sizes in order from smallest to largest are 1T, 1S, 1M, and 1L. These sizes have different values. Size 1T is one size smaller than size 1S, two sizes smaller than 1M, etc. If a rule affects size 1 creatures, the rule applies to all size 1 creatures.'
                }
            ]
        },
        {
            title: 'Movement',
            kind: 'rule',
            description: 'Keywords you will find throughout abilities and features',
            subRules: [
                {
                    title: 'Basics',
                    kind: 'rule',
                    description: 'A single move or other effect can never allow a creature to move more squares than their speed, unless the effect specifically states otherwise.\n\nAll squares adjacent to your character cost 1 movement to move into, even diagonally. A creature can’t move diagonally when doing so would allow them to cross the corner of a wall or other structure the fills the corner between your space and the space you are moving to. This rule applies only to moving by objects, not creatures.'
                },
                {
                    title: 'Climb',
                    kind: 'rule',
                    description: 'If a creature’s speed entry includes the word "climb," they can climb across vertical and horizontal surfaces at full speed. Creatures without those types of movement can still climb when a rule allows them to move, but each square of climbing costs 2 squares of movement.'
                },
                {
                    title: 'Crawl',
                    kind: 'rule',
                    description: 'If you are prone, you can remain prone and crawl on the ground. Doing so costs you 1 additional square of movement for every square you crawl. If you intentionally want to crawl, you can fall prone as a free maneuver on your turn. While voluntarily prone, you can choose to stand as a free maneuver.'
                },
                {
                    title: 'Forced Movement',
                    kind: 'rule',
                    description: 'When you force move a target, you can always move that target fewer squares than the number indicated.',
                    subRules: [

                    ]
                },
                {
                    title: 'Difficult Terrain',
                    kind: 'rule',
                    description: 'It costs 1 additional square of movement to enter difficult terrain (rubble, underbrush, etc.).'
                },
                {
                    title: 'Jump',
                    kind: 'rule',
                    description: 'As part of movement, long jump up to Might/Agility score (min 1) automatically. Height is 1. To jump further, make a Might/Agility test (2d10 + score): \n• 11-: No extra distance.\n• 12-16: +1 square long and high.\n• 17+: +2 squares long and high.'
                },
                {
                    title: 'Teleport',
                    kind: 'rule',
                    description: 'Instant movement. Bypasses obstacles. Does not provoke opportunity attacks. Requires line of effect. Ends Grabbed/Restrained conditions.'
                },
                {
                    title: 'Shifting',
                    kind: 'rule',
                    description: 'Move without provoking opportunity attacks. Cannot shift into difficult terrain.'
                }
            ]
        },
        {
            title: 'Forced Movement',
            kind: 'rule',
            description: 'You can move targets fewer squares than indicated.',
            subRules: [
                {
                    title: 'Push X',
                    kind: 'rule',
                    description: 'You move the target up to X squares away from you in a straight line, without moving them vertically. Each square you move the creature must put them further away from you.'
                },
                {
                    title: 'Pull X',
                    kind: 'rule',
                    description: 'You move the target up to X squares toward you in a straight line, without moving them vertically. Each square you move the creature must bring them closer to you.'
                },
                {
                    title: 'Slide X',
                    kind: 'rule',
                    description: 'You move the target up to X squares in any direction, except for vertically.'
                },
                {
                    title: 'Vertical',
                    kind: 'rule',
                    description: 'If a forced movement effect has the word "vertical" in front of it, then the forced movement can move a target up or down in addition to horizontally.'
                },
                {
                    title: 'Big vs. Little',
                    kind: 'rule',
                    description: 'When a larger creature force moves a smaller creature with a melee weapon ability, the force move distance is increased by 1. If a smaller creature force moves a larger creature with a melee weapon ability, the force move distance does not change.'
                },
                {
                    title: 'Breaking Objects',
                    kind: 'rule',
                    description: 'When you move a creature into an object, the object can break depending on how many squares of forced movement remain. The cost of being slammed into an object is baked into the damage you take for being hurled through it.\n\n* It costs 1 remaining square of forced movement to destroy 1 square of glass. The creature moved takes 3 damage.\n* It costs 3 remaining squares of forced movement to destroy 1 square of wood. The creature moved takes 5 damage.\n* It costs 6 remaining squares of forced movement to destroy 1 square of stone. The creature moved takes 8 damage.\n* It costs 9 remaining squares of forced movement to destroy 1 square of metal. The creature moved takes 11 damage.\n\nIf any forced movement remains after the object is destroyed, you can continue to move the creature who destroyed the object.'
                },
                {
                    title: 'Slamming into Creatures',
                    kind: 'rule',
                    description: 'When you force move a creature into another creature, the movement ends and both creatures take 1 damage for each square remaining in the first creature’s forced movement. You can force move another creature into yourself with a pull or a slide.\n\nIf a creature is killed by damage from an ability or effect that force moves them, the second creature still takes damage.'
                },
                {
                    title: 'Slamming into Objects',
                    kind: 'rule',
                    description: 'When you force move a creature into a stationary object that is their size or larger, the movement ends and the creature takes 2 damage plus 1 damage for each square remaining in their forced movement.'
                },
                {
                    title: 'Stability',
                    kind: 'rule',
                    description: 'Each creature has a stability that allows them to resist forced movement. When a creature is forced moved, they can reduce the movement up to a number of squares equal to their stability.'
                }
            ]
        },
        {
            title: 'Areas of Effect',
            kind: 'rule',
            description: 'Area abilities cover an area, creating an effect within that area that lets you target multiple creatures or objects at once. When an ability allows you to create an area of effect, you are sometimes given a distance, noted as "within X," that describes how many squares away from you the area can be. If an area ability doesn’t originate from you, then least 1 square of the area of effect must be within that distance and your line of effect. This square is referred to as the origin square of the area of effect. The area of effect can spread from the origin square however you choose, as long as the area of effect conforms to the shape and arrangement rules of that particular area. Unless otherwise noted, area abilities don’t pass through solid barriers such as walls or ceilings, or spread around corners. As long as you have line of effect and distance to the origin square, you can place an area ability to include one or more squares where you don’t have line of effect.',
            subRules: [
                {
                    title: 'Aura',
                    kind: 'rule',
                    description: 'When an ability creates an aura, that area is expressed as "X aura." The number X is the radius of the aura, which always originates from you and moves with you for the duration of the ability that created it. A creature or object must be within X squares of you to be targeted with an aura ability.'
                },
                {
                    title: 'Burst',
                    kind: 'rule',
                    description: 'When an ability creates a burst area, that area is expressed as "X burst." The number X is the radius of the burst, which always originates from you and lasts only for as long as it takes to affect its targets. A creature or object must be within X squares of you to be targeted with a burst ability.'
                },
                {
                    title: 'Cube',
                    kind: 'rule',
                    description: 'When an ability affects a cubic area, that area is expressed as "X cube." The number X is the length of each of the area’s sides. A creature or object must be within the area to be targeted with a cube ability.'
                },
                {
                    title: 'Line',
                    kind: 'rule',
                    description: 'When an ability affects a linear area, that area is expressed as "A x B line." The number A denotes the line’s length in squares, while the number B equals the line’s width and height in squares. When you create a line area of effect, the squares in that area must be in a straight line. A creature or object must be within the area to be targeted with a line ability.'
                },
                {
                    title: 'Wall',
                    kind: 'rule',
                    description: 'When an ability creates a wall, that area is expressed as "X wall." The number X is how many squares are used to make the wall. When you place a wall, you can build it one square at a time, but each square must share at least one side (not just a corner) with another square of the wall. A creature or object must be within the area to be targeted with a wall ability. You can stack squares on top of each other to make the wall higher. Unless otherwise stated, a wall can’t be placed in occupied squares, and a wall blocks line of effect.'
                }
            ]
        }
    ],
    actions: [
        {
            title: 'Grab',
            kind: 'ability',
            type: 'Maneuver',
            keywords: ['Melee', 'Weapon'],
            distance: 'Melee 1',
            target: 'One creature',
            characteristic: ['Might'],
            powerRoll: [
                { tier: 1, range: '11-', effect: 'No effect.' },
                { tier: 2, range: '12-16', effect: 'You can grab the target, but if you do, the target can make a melee free strike against you before they are grabbed.' },
                { tier: 3, range: '17+', effect: 'The target is grabbed by you.' }
            ],
            effectText: 'Effect: Target must be your size or smaller. If your Might is 2+, you can target creatures with Size <= Might.'
        },
        {
            title: 'Aid Attack',
            kind: 'ability',
            type: 'Maneuver',
            distance: 'Melee 1',
            target: 'Adjacent enemy',
            effectText: 'Choose an adjacent enemy. The next ability power roll an ally makes against them before the start of your next turn has an edge.'
        },
        {
            title: 'Catch Breath',
            kind: 'ability',
            type: 'Maneuver',
            distance: 'Self',
            target: 'Self',
            effectText: 'Spend a Recovery. (Cannot be used while Dying).'
        },
        {
            title: 'Knockback',
            kind: 'ability',
            type: 'Maneuver',
            keywords: ['Melee', 'Weapon'],
            distance: 'Melee 1',
            target: 'One creature',
            characteristic: ['Might'],
            powerRoll: [
                { tier: 1, range: '11-', effect: 'Push 1' },
                { tier: 2, range: '12-16', effect: 'Push 2' },
                { tier: 3, range: '17+', effect: 'Push 3' }
            ],
            effectText: 'Effect: You can usually target only creatures of your size or smaller. If Might is 2+, target any creature size <= Might score.'
        },
        {
            title: 'Escape Grab',
            kind: 'ability',
            type: 'Maneuver',
            distance: 'Self',
            target: 'Self',
            characteristic: ['Might', 'Agility'],
            powerRoll: [
                { tier: 1, range: '11-', effect: 'No effect.' },
                { tier: 2, range: '12-16', effect: 'You can escape the grab, but if you do, a creature who has you grabbed can make a melee free strike against you before you are no longer grabbed.' },
                { tier: 3, range: '17+', effect: 'You are no longer grabbed.' }
            ],
            effectText: 'Effect: You take a bane on this maneuver if your size is smaller than the size of the creature, object, or effect that has you grabbed.'
        },
        {
            title: 'Stand Up',
            kind: 'ability',
            type: 'Maneuver',
            distance: 'Self',
            target: 'Self',
            effectText: 'You stand up from prone, ending that condition. Alternatively, you can use this maneuver to make an adjacent prone creature stand up.'
        },
        {
            title: 'Heal',
            kind: 'ability',
            type: 'Main Action',
            distance: 'Melee 1',
            target: 'Adjacent creature',
            effectText: 'Choose an adjacent creature who can spend a Recovery or make a saving throw.'
        },
        {
            title: 'Hide',
            kind: 'ability',
            type: 'Main Action',
            distance: 'Self',
            target: 'Self',
            effectText: 'You become hidden from creatures who aren\'t observing you while you have cover or concealment from them.'
        },
        {
            title: 'Free Strike',
            kind: 'ability',
            type: 'Main Action',
            distance: 'Weapon Range',
            target: 'One creature',
            effectText: 'You make a free strike.'
        },
        {
            title: 'Advance',
            kind: 'ability',
            type: 'Move Action',
            distance: 'Speed',
            target: 'Self',
            effectText: 'Move a number of squares up to your speed. You can break up this movement with your maneuver and action.'
        },
        {
            title: 'Disengage',
            kind: 'ability',
            type: 'Move Action',
            distance: '1 square',
            target: 'Self',
            effectText: 'Shift 1 square (does not provoke opportunity attacks).'
        },
        {
            title: 'Ride',
            kind: 'ability',
            type: 'Move Action',
            distance: 'Mount Speed',
            target: 'Your mount',
            effectText: 'Cause a mount you are riding to take the Advance move action. A mount can only benefit from this once per round.'
        },
        {
            title: 'Charge',
            kind: 'ability',
            type: 'Main Action',
            distance: 'Speed',
            target: 'Self',
            effectText: 'Move up to your speed in a straight line without shifting, and can then make a melee free strike or use an ability with the Charge keyword against a creature when you end your move.'
        },
        {
            title: 'Defend',
            kind: 'ability',
            type: 'Main Action',
            distance: 'Self',
            target: 'Self',
            effectText: 'All ability power rolls made against you have a double bane until the start of your next turn.'
        }
    ],
    conditions: [
        {
            title: 'Bleeding',
            kind: 'condition',
            effect: 'While a creature is bleeding, whenever they use a main action, use a triggered action, or make a test or ability power roll using Might or Agility, they lose Stamina equal to 1d6 + their level after the main action, triggered action, or power roll is resolved. This Stamina loss can’t be prevented in any way.\n\nYou take damage from this condition when you use a main action you use off your turn. For example, a signature attack used as a free triggered action with the assistance of the tactician’s Strike Now ability triggers the damage from the bleeding condition.'
        },
        {
            title: 'Dazed',
            kind: 'condition',
            effect: 'A creature who is dazed can do only one thing on their turn: use a main action, use a maneuver, or use a move action. A dazed creature also can’t use triggered actions, free triggered actions, or free maneuvers.'
        },
        {
            title: 'Frightened',
            kind: 'condition',
            effect: 'When a creature is frightened, any ability roll they make against the source of their fear takes a bane. If that source is a creature, their ability rolls made against the frightened creature gain an edge. A frightened creature can’t willingly move closer to the source of their fear if they know the location of that source. If a creature gains the frightened condition from one source while already frightened by a different source, the new condition replaces the old one.'
        },
        {
            title: 'Grabbed',
            kind: 'condition',
            effect: 'A creature who is grabbed has speed 0, can’t be force moved except by a creature, object, or effect that has them grabbed, can’t use the Knockback maneuver, and takes a bane on abilities that don’t target the creature, object, or effect that has them grabbed. If a creature is grabbed by another creature and that creature moves, they bring the grabbed creature with them. If a creature’s size is equal to or less than the size of a creature they have grabbed, their speed is halved while they have that creature grabbed.\n\nA creature who has another creature grabbed can use a maneuver to move the grabbed creature into an unoccupied space adjacent to them.\n\nA creature can release a creature they have grabbed at any time to end that condition (no action required). A grabbed creature can attempt to escape being grabbed using the Escape Grab maneuver. If a grabbed creature teleports, or if either the grabbed creature or the creature grabbing them is force moved so that both creatures are no longer adjacent to each other, that creature is no longer grabbed.\n\nA creature can grab only creatures of their size or smaller. If a creature’s Might score is 2 or higher, they can grab any creature larger than them with a size equal to or less than their Might score.\n\nUnless otherwise indicated, a creature can grab only one creature at a time.'
        },
        {
            title: 'Prone',
            kind: 'condition',
            effect: 'While a creature is prone, they are flat on the ground, any strike they make takes a bane, and melee abilities used against them gain an edge. A prone creature must crawl to move along the ground, which costs 1 additional square of movement for every square crawled. A creature can’t climb, jump, swim, or fly while prone. If they are climbing, flying, or jumping when knocked prone, they fall.\n\nUnless the ability or effect that imposed the prone condition says otherwise, a prone creature can stand up using the Stand Up maneuver. A creature adjacent to a willing prone creature can likewise use the Stand Up maneuver to make that creature stand up.'
        },
        {
            title: 'Restrained',
            kind: 'condition',
            effect: 'A creature who is restrained has speed 0, can’t use the Stand Up maneuver, and can’t be force moved. A restrained creature takes a bane on ability rolls and on Might and Agility tests, and abilities used against them gain an edge.\n\nIf a creature teleports while restrained, that condition ends.'
        },
        {
            title: 'Slowed',
            kind: 'condition',
            effect: 'A creature who is slowed has speed 2 unless their speed is already lower, and they can’t shift.'
        },
        {
            title: 'Taunted',
            kind: 'condition',
            effect: 'A creature who is taunted has a double bane on ability rolls for any ability that doesn’t target the creature who taunted them, as long as they have line of effect to that creature. If a creature gains the taunted condition from one source while already taunted by a different source, the new condition replaces the old one.'
        },
        {
            title: 'Weakened',
            kind: 'condition',
            effect: 'A creature who is weakened takes a bane on power rolls.'
        }
    ]
};

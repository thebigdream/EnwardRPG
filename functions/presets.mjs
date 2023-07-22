export const defaultDescPresetClio = {
    "ban_brackets": true,
    "use_string": true,
    "repetition_penalty": 3.0,
    "repetition_penalty_frequency": 0,
    "repetition_penalty_presence": 0,
    "repetition_penalty_range": 2000,
    "repetition_penalty_slope": 0.1,
    "temperature": 0.75,
    "top_k": 100,
    "top_p": 10,
    "tail_free_sampling": 1,
    "min_length": 64,
    "max_length": 128,
    "generate_until_sentence": true,
    //"stop_sequences": [[]],
    "bad_words_ids": 
    [
        [23], //***
        [24], //----
        [25], // "
        [58], //<|maskend|>
        [60], //<|fillend|>
        [85], //\n
        [530], // -
        [588], //."
        [625], //..
        [821], //...
        [1165], // '
        [1214], //:
        [1431], // [
        [15033], //.]
        [2082], //....
        [2811], //.'
        [3662], //::
        [4035], // ...
        [5473], //],
        [7595], // `
        [7794], // ]
        [7975], // ![
        [8209], //!!!s
        [8958], //author
        [10601], //.[
        [10681], //][
        [15614], //Author
        [20932], // ..
        [32303], //]:
        [49211, 7001], //tags
        [49247, 7001], //Tags
        [49264], //"
        [49287], //:
        [49302], //=
        [49352], //]
        [49356], //[
        [49360], //;
        [49405], //>
        [49438], //<
        [49969], //`
        [51007], //❤
        [52488], //😉
        [52939], //👀
        [53095], //💦
        [53466], //😄
        [53539], //😩
        [53449], //😏
        [53849], //👍
        [54489], //🤔
        [54848], //😁
    ],
    "logit_bias_exp": [{"bias":0.05,"ensure_sequence_finish":true,"generate_once":false,"sequence":[[13]]}, {"bias":-0.2,"ensure_sequence_finish":true,"generate_once":true,"sequence":[[30],[16]]}]
}

export const defaultPresetClio = {
    "ban_brackets": true,
    "use_string": true,
    "repetition_penalty": 3.75,
    "repetition_penalty_frequency": 0,
    "repetition_penalty_presence": 0,
    "repetition_penalty_range": 2000,
    "repetition_penalty_slope": 0.1,
    "temperature": 0.75,
    "top_k": 100,
    "top_p": 5,
    "tail_free_sampling": 1,
    "min_length": 32,
    "max_length": 64,
    "generate_until_sentence": true,
    //"stop_sequences": [[]],
    "bad_words_ids": 
    [
        [23], //***
        [24], //----
        [25], // "
        [58], //<|maskend|>
        [60], //<|fillend|>
        [85], //\n
        [530], // -
        [588], //."
        [625], //..
        [821], //...
        [1165], // '
        [1214], //:
        [1431], // [
        [2082], //....
        [2811], //.'
        [3662], //::
        [4035], // ...
        [5473], //],
        [7595], // `
        [7794], // ]
        [7975], // ![
        [8209], //!!!s
        [8958], //author
        [10601], //.[
        [10681], //][
        [15033], //.]
        [15614], //Author
        [20932], // ..
        [32303], //]:
        [49211, 7001], //tags
        [49247, 7001], //Tags
        [49264], //"
        [49287], //:
        [49302], //=
        [49352], //]
        [49356], //[
        [49360], //;
        [49405], //>
        [49438], //<
        [49969], //`
        [51007], //❤
        [52488], //😉
        [52939], //👀
        [53095], //💦
        [53466], //😄
        [53539], //😩
        [53449], //😏
        [53849], //👍
        [54489], //🤔
        [54848], //😁
    ],
    "logit_bias_exp": [{"bias":0.05,"ensure_sequence_finish":true,"generate_once":false,"sequence":[[13]]}, {"bias":-0.2,"ensure_sequence_finish":true,"generate_once":true,"sequence":[[30],[16]]}]
}

export const defaultListPresetClio = {
    "ban_brackets": true,
    "use_string": true,
    "repetition_penalty": 3.5,
    "repetition_penalty_frequency": 0,
    "repetition_penalty_presence": 0,
    "repetition_penalty_range": 2000,
    "repetition_penalty_slope": 0.1,
    "temperature": 0.8,
    "top_k": 300,
    "top_p": 10,
    "tail_free_sampling": 1,
    "min_length": 32,
    "max_length": 64,
    "generate_until_sentence": true,
    //"stop_sequences": [[]],
    "bad_words_ids": 
    [
        [4], //0
        [5], //1
        [6], //2
        [7], //3
        [8], //4
        [9], //5
        [10], //6
        [11], //7
        [12], //8
        [13], //9
        [23], //***
        [24], //----
        [25], // "
        [58], //<|maskend|>
        [60], //<|fillend|>
        [85], //\n
        [530], // -
        [625], //..
        [821], //...
        [837], // ,
        [1165], // '
        [1214], //:
        [1431], // [
        [2082], //....
        [3662], //::
        [4035], // ...
        [5473], //],
        [7595], // `
        [7794], // ]
        [7975], // ![
        [8209], //!!!s
        [8958], //author
        [10601], //.[
        [10681], //][
        [15033], //.]
        [15614], //Author
        [20932], // ..
        [32303], //]:
        [49211, 7001], //tags
        [49230], //.
        [49231, 49209], //, 
        [49247, 7001], //Tags
        [49264], //"
        [49287], //:
        [49302], //=
        [49352], //]
        [49356], //[
        [49360], //;
        [49405], //>
        [49438], //<
        [49969], //`
        [51007], //❤
        [52488], //😉
        [52939], //👀
        [53095], //💦
        [53466], //😄
        [53539], //😩
        [53449], //😏
        [53849], //👍
        [54489], //🤔
        [54848], //😁
    ],
    "logit_bias_exp": [{"bias":0.2,"ensure_sequence_finish":true,"generate_once":false,"sequence":[[11]]}, {"bias":-2.0,"ensure_sequence_finish":true,"generate_once":true,"sequence":[[30]]}]
}
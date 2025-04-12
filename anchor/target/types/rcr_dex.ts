/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/rcr_dex.json`.
 */
export type RcrDex = {
  "address": "DX4TnoHCQoCCLC5pg7K49CMb9maMA3TMfHXiPBD55G1w",
  "metadata": {
    "name": "rcrDex",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "changeAmmAdmin",
      "discriminator": [
        130,
        88,
        235,
        133,
        24,
        247,
        1,
        208
      ],
      "accounts": [
        {
          "name": "amm",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  97,
                  109,
                  109
                ]
              }
            ]
          }
        },
        {
          "name": "newAdmin"
        },
        {
          "name": "payer",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "createAmm",
      "discriminator": [
        242,
        91,
        21,
        170,
        5,
        68,
        125,
        64
      ],
      "accounts": [
        {
          "name": "amm",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  97,
                  109,
                  109
                ]
              }
            ]
          }
        },
        {
          "name": "admin",
          "docs": [
            "check : Adding a admin to the AMM"
          ]
        },
        {
          "name": "payer",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "createPool",
      "discriminator": [
        233,
        146,
        209,
        142,
        207,
        104,
        64,
        188
      ],
      "accounts": [
        {
          "name": "amm",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  97,
                  109,
                  109
                ]
              }
            ]
          }
        },
        {
          "name": "pool",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  111,
                  111,
                  108
                ]
              },
              {
                "kind": "account",
                "path": "amm"
              },
              {
                "kind": "account",
                "path": "mintA"
              },
              {
                "kind": "account",
                "path": "mintB"
              }
            ]
          }
        },
        {
          "name": "mintLiquidity",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  108,
                  105,
                  113,
                  117,
                  105,
                  100,
                  105,
                  116,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "pool"
              }
            ]
          }
        },
        {
          "name": "mintA"
        },
        {
          "name": "mintB"
        },
        {
          "name": "poolAccountA",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  111,
                  111,
                  108,
                  45,
                  97,
                  99,
                  99,
                  111,
                  117,
                  110,
                  116,
                  45,
                  97
                ]
              },
              {
                "kind": "account",
                "path": "pool"
              },
              {
                "kind": "account",
                "path": "mintA"
              }
            ]
          }
        },
        {
          "name": "poolAccountB",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  111,
                  111,
                  108,
                  45,
                  97,
                  99,
                  99,
                  111,
                  117,
                  110,
                  116,
                  45,
                  98
                ]
              },
              {
                "kind": "account",
                "path": "pool"
              },
              {
                "kind": "account",
                "path": "mintB"
              }
            ]
          }
        },
        {
          "name": "admin",
          "docs": [
            "check : Adding a admin to the AMM"
          ],
          "writable": true,
          "relations": [
            "amm"
          ]
        },
        {
          "name": "payer",
          "docs": [
            "The account paying for all rents"
          ],
          "writable": true,
          "signer": true
        },
        {
          "name": "tokenProgram",
          "docs": [
            "Solana ecosystem accounts"
          ]
        },
        {
          "name": "associatedTokenProgram",
          "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "fees",
          "type": "u64"
        }
      ]
    },
    {
      "name": "depositLiquidity",
      "discriminator": [
        245,
        99,
        59,
        25,
        151,
        71,
        233,
        249
      ],
      "accounts": [
        {
          "name": "amm",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  97,
                  109,
                  109
                ]
              }
            ]
          },
          "relations": [
            "pool"
          ]
        },
        {
          "name": "pool",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  111,
                  111,
                  108
                ]
              },
              {
                "kind": "account",
                "path": "amm"
              },
              {
                "kind": "account",
                "path": "mintA"
              },
              {
                "kind": "account",
                "path": "mintB"
              }
            ]
          }
        },
        {
          "name": "depositor",
          "docs": [
            "The account getting liquidity tokens & adding liquidity amount"
          ],
          "writable": true,
          "signer": true
        },
        {
          "name": "mintLiquidity",
          "writable": true,
          "relations": [
            "pool"
          ]
        },
        {
          "name": "mintA",
          "relations": [
            "pool"
          ]
        },
        {
          "name": "mintB",
          "relations": [
            "pool"
          ]
        },
        {
          "name": "poolAccountA",
          "writable": true,
          "relations": [
            "pool"
          ]
        },
        {
          "name": "poolAccountB",
          "writable": true,
          "relations": [
            "pool"
          ]
        },
        {
          "name": "depositorAccountLiquidity",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "depositor"
              },
              {
                "kind": "account",
                "path": "tokenProgram"
              },
              {
                "kind": "account",
                "path": "mintLiquidity"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "depositorAccountA",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "depositor"
              },
              {
                "kind": "account",
                "path": "tokenProgram"
              },
              {
                "kind": "account",
                "path": "mintA"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "depositorAccountB",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "depositor"
              },
              {
                "kind": "account",
                "path": "tokenProgram"
              },
              {
                "kind": "account",
                "path": "mintB"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "tokenProgram",
          "docs": [
            "Solana ecosystem accounts"
          ]
        },
        {
          "name": "associatedTokenProgram",
          "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "amountA",
          "type": "u64"
        },
        {
          "name": "amountB",
          "type": "u64"
        },
        {
          "name": "minLiquidity",
          "type": "u64"
        },
        {
          "name": "fees",
          "type": "u64"
        },
        {
          "name": "useEntireAmount",
          "type": "bool"
        }
      ]
    },
    {
      "name": "swapExactInput",
      "discriminator": [
        194,
        203,
        142,
        150,
        137,
        110,
        81,
        94
      ],
      "accounts": [
        {
          "name": "amm",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  97,
                  109,
                  109
                ]
              }
            ]
          },
          "relations": [
            "pool"
          ]
        },
        {
          "name": "pool",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  111,
                  111,
                  108
                ]
              },
              {
                "kind": "account",
                "path": "amm"
              },
              {
                "kind": "account",
                "path": "mintA"
              },
              {
                "kind": "account",
                "path": "mintB"
              }
            ]
          }
        },
        {
          "name": "trader",
          "docs": [
            "The account doing the swap"
          ],
          "writable": true,
          "signer": true
        },
        {
          "name": "mintA",
          "relations": [
            "pool"
          ]
        },
        {
          "name": "mintB",
          "relations": [
            "pool"
          ]
        },
        {
          "name": "poolAccountA",
          "writable": true,
          "relations": [
            "pool"
          ]
        },
        {
          "name": "poolAccountB",
          "writable": true,
          "relations": [
            "pool"
          ]
        },
        {
          "name": "traderAccountA",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "trader"
              },
              {
                "kind": "account",
                "path": "tokenProgram"
              },
              {
                "kind": "account",
                "path": "mintA"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "traderAccountB",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "trader"
              },
              {
                "kind": "account",
                "path": "tokenProgram"
              },
              {
                "kind": "account",
                "path": "mintB"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "tokenProgram",
          "docs": [
            "Solana ecosystem accounts"
          ]
        },
        {
          "name": "associatedTokenProgram",
          "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "swapA",
          "type": "bool"
        },
        {
          "name": "inputAmount",
          "type": "u64"
        },
        {
          "name": "minOutputAmount",
          "type": "u64"
        },
        {
          "name": "deltaPriceChange",
          "type": "u64"
        },
        {
          "name": "fees",
          "type": "u64"
        }
      ]
    },
    {
      "name": "swapExactOutput",
      "discriminator": [
        45,
        99,
        76,
        242,
        223,
        112,
        168,
        162
      ],
      "accounts": [
        {
          "name": "amm",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  97,
                  109,
                  109
                ]
              }
            ]
          },
          "relations": [
            "pool"
          ]
        },
        {
          "name": "pool",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  111,
                  111,
                  108
                ]
              },
              {
                "kind": "account",
                "path": "amm"
              },
              {
                "kind": "account",
                "path": "mintA"
              },
              {
                "kind": "account",
                "path": "mintB"
              }
            ]
          }
        },
        {
          "name": "trader",
          "docs": [
            "The account doing the swap"
          ],
          "writable": true,
          "signer": true
        },
        {
          "name": "mintA",
          "relations": [
            "pool"
          ]
        },
        {
          "name": "mintB",
          "relations": [
            "pool"
          ]
        },
        {
          "name": "poolAccountA",
          "writable": true,
          "relations": [
            "pool"
          ]
        },
        {
          "name": "poolAccountB",
          "writable": true,
          "relations": [
            "pool"
          ]
        },
        {
          "name": "traderAccountA",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "trader"
              },
              {
                "kind": "account",
                "path": "tokenProgram"
              },
              {
                "kind": "account",
                "path": "mintA"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "traderAccountB",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "trader"
              },
              {
                "kind": "account",
                "path": "tokenProgram"
              },
              {
                "kind": "account",
                "path": "mintB"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "tokenProgram",
          "docs": [
            "Solana ecosystem accounts"
          ]
        },
        {
          "name": "associatedTokenProgram",
          "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "swapA",
          "type": "bool"
        },
        {
          "name": "outputAmount",
          "type": "u64"
        },
        {
          "name": "maxInputAmount",
          "type": "u64"
        },
        {
          "name": "deltaPriceChange",
          "type": "u64"
        },
        {
          "name": "fees",
          "type": "u64"
        }
      ]
    },
    {
      "name": "withdrawLiquidity",
      "discriminator": [
        149,
        158,
        33,
        185,
        47,
        243,
        253,
        31
      ],
      "accounts": [
        {
          "name": "amm",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  97,
                  109,
                  109
                ]
              }
            ]
          }
        },
        {
          "name": "pool",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  111,
                  111,
                  108
                ]
              },
              {
                "kind": "account",
                "path": "amm"
              },
              {
                "kind": "account",
                "path": "mintA"
              },
              {
                "kind": "account",
                "path": "mintB"
              }
            ]
          }
        },
        {
          "name": "depositor",
          "docs": [
            "The account paying for all rents"
          ],
          "writable": true,
          "signer": true
        },
        {
          "name": "mintLiquidity",
          "writable": true,
          "relations": [
            "pool"
          ]
        },
        {
          "name": "mintA",
          "relations": [
            "pool"
          ]
        },
        {
          "name": "mintB",
          "relations": [
            "pool"
          ]
        },
        {
          "name": "poolAccountA",
          "writable": true,
          "relations": [
            "pool"
          ]
        },
        {
          "name": "poolAccountB",
          "writable": true,
          "relations": [
            "pool"
          ]
        },
        {
          "name": "depositorAccountLiquidity",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "depositor"
              },
              {
                "kind": "account",
                "path": "tokenProgram"
              },
              {
                "kind": "account",
                "path": "mintLiquidity"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "depositorAccountA",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "depositor"
              },
              {
                "kind": "account",
                "path": "tokenProgram"
              },
              {
                "kind": "account",
                "path": "mintA"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "depositorAccountB",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "depositor"
              },
              {
                "kind": "account",
                "path": "tokenProgram"
              },
              {
                "kind": "account",
                "path": "mintB"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "tokenProgram",
          "docs": [
            "Solana ecosystem accounts"
          ]
        },
        {
          "name": "associatedTokenProgram",
          "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "liquidityAmount",
          "type": "u64"
        },
        {
          "name": "minAmountA",
          "type": "u64"
        },
        {
          "name": "minAmountB",
          "type": "u64"
        },
        {
          "name": "fees",
          "type": "u64"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "amm",
      "discriminator": [
        143,
        245,
        200,
        17,
        74,
        214,
        196,
        135
      ]
    },
    {
      "name": "pool",
      "discriminator": [
        241,
        154,
        109,
        4,
        17,
        177,
        109,
        188
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "invalidAdmin",
      "msg": "Invalid admin call"
    },
    {
      "code": 6001,
      "name": "invalidFee",
      "msg": "Invalid fee value"
    },
    {
      "code": 6002,
      "name": "inTokensOrder",
      "msg": "Change order of tokens"
    },
    {
      "code": 6003,
      "name": "insufficientBalance",
      "msg": "Insufficient token balance"
    },
    {
      "code": 6004,
      "name": "inBalanceOptimalAmounts",
      "msg": "Adding liquidity with in balance ratio"
    },
    {
      "code": 6005,
      "name": "insufficientLiquidity",
      "msg": "Liquidity is not sufficient"
    },
    {
      "code": 6006,
      "name": "minLiquidityError",
      "msg": "Minimum liquidity is not met"
    },
    {
      "code": 6007,
      "name": "zeroAmount",
      "msg": "Invalid zero amount"
    },
    {
      "code": 6008,
      "name": "outputTooSmall",
      "msg": "Output amount is small"
    },
    {
      "code": 6009,
      "name": "outputTooHigh",
      "msg": "Output amount is high"
    },
    {
      "code": 6010,
      "name": "invalidPriceChange",
      "msg": "Unexpected change of price"
    },
    {
      "code": 6011,
      "name": "invalidDeltaPrice",
      "msg": "Invalid delta price percentage"
    },
    {
      "code": 6012,
      "name": "transferFailed",
      "msg": "Transfering SOL failed"
    }
  ],
  "types": [
    {
      "name": "amm",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "admin",
            "type": "pubkey"
          },
          {
            "name": "poolCount",
            "type": "u16"
          },
          {
            "name": "ammBump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "pool",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "amm",
            "type": "pubkey"
          },
          {
            "name": "mintA",
            "type": "pubkey"
          },
          {
            "name": "mintB",
            "type": "pubkey"
          },
          {
            "name": "fees",
            "type": "u64"
          },
          {
            "name": "mintLiquidity",
            "type": "pubkey"
          },
          {
            "name": "poolAccountA",
            "type": "pubkey"
          },
          {
            "name": "poolAccountB",
            "type": "pubkey"
          },
          {
            "name": "poolBump",
            "type": "u8"
          },
          {
            "name": "poolMintLiquidityBump",
            "type": "u8"
          },
          {
            "name": "poolAccountABump",
            "type": "u8"
          },
          {
            "name": "poolAccountBBump",
            "type": "u8"
          }
        ]
      }
    }
  ],
  "constants": [
    {
      "name": "minimumLiquidity",
      "type": "u64",
      "value": "100"
    }
  ]
};

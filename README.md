# The graph demo2
[doodles](https://opensea.io/collection/doodles-official)のサブグラフの作成。

## init

```
graph init --from-contract 0x8a90CAb2b38dba80c64b7734e58Ee1dB38B8992e --contract-name Doodle --index-events
```

## codegen

```
graph codegen
```

## deploy

```
graph auth --product hosted-service <access_token>
graph deploy --product hosted-service jy8752/doodle
```
# Homework 1

## Abstract

This project contains the code for a client and a server that transmit large amounts of data over TCP and UDP protocols

## Setup

The project requires that the packages from the `requirements.txt` file to be installed.

```sh
$ pip install -r requirements.txt
```

## Running

Run the following command:

```sh
$ ./run.sh
```

## Statistics

### TCP

While running locally, the following metrics were gathered:

Bytes | Time server | Time client
-|-|-
`16000 B = 16 kB` | `0.001s` - `0.07s` | `0.001s` - `0.008s`
`16000000 B = 16 MB` | `3.20s` - `3.61s` | `1.98s` - `2.24s`
`16000000000 B = 1.6 GB` | `` - `` | `` - ``


### UDP

While running locally, the following metrics were gathered:

Bytes | Time server | Time client
-|-|-
`16000 B = 16 kB` | `0.06s` - `0.07s` | `0.04s` - `0.06s`
`16000000 B = 16 MB` | `64s` - `68.4s` | `62s` - `64s`

> Implementation is slow :\(

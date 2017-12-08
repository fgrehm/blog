---
title: "Adventures in Serverless land to Support a Fight Against Corruption"
date: '2017-11-28'
description: 'As most people in tech know, Serverless is the new "hotness". This post outlines my initial experience with it, the issues I had along the way and some considerations in case you, like me, are thinking about giving it a try for the first time'
tags:
- serverless
- serenata-de-amor
- ocr
---

As most people in tech know, Serverless is the new ~~buzzword~~ “hotness" and
lots of blog posts / books / utilities / tweets are being written about it every
day. This post outlines my initial experience with it, the issues I had along
the way and some considerations in case you, like me, are thinking about giving
it a try for the first time.

## The idea

Not many people outside of Brazil might've heard about the [Serenata de
Amor](https://serenatadeamor.org/en/) project but it is making a lot of noise in
this side of the globe. Without going too deep into the details, Operação
Serenata de Amor is an Artificial Intelligence and Data Science project that
aims to inform the general public about government corruption and spending. More
info can be found at the project's website and [this nice podcast at The
Changelog](https://changelog.com/podcast/268).

So far, the main focus of the team and where it currently excels is analyzing
meal reimbursements from congresspeople. Those reimbursements are provided to
them through the CEAP ("Cota para Exercício da Atividade Parlamentar" or "Quota
for Exercising Parliamentary Activity" in English) by the [Chamber of Deputies](https://en.wikipedia.org/wiki/Chamber_of_Deputies_(Brazil)):

<center>
  <img src="https://serenatadeamor.org/images/infographic.png" alt="serenata-infographic" />
  <em>A bit of context on some of the rationale behind the project (source: Serenata's Website).<br>As of today, R$1 = US$0.31</em>
</center>

One of the things of interest of the project is "reading" scanned reimbursement
receipt PDFs provided by deputies in search for things like alcoholic beverages
and exact timestamps of when a meal was purchased. That data can be used to flag
congress person's reimbursements as suspicious given they should not be
reimbursed for alcohol. Another use case is crossing the timestamps found in the
receipt with other datasets we have about parliamentary activity: if a congress
person was in a session and the meal receipt is around the same time in another
city, it probably means he/she bought food for other people (also not allowed).

## Why do I think a serverless architecture makes sense for this?

Mostly to reduce operational overhead and costs of managing dedicated servers
for getting the job done.

To solve the PDF to text problem we need to
[OCR](https://en.wikipedia.org/wiki/Optical_character_recognition) those
receipts that are basically "scanned pieces of paper" (not a nice PDF generated
by Word that you can search with Ctrl+F). In other words, they are actually
_images_ inside a PDF! While we could put together some self hosted infra for
this using OSS tools like
[Tesseract](https://github.com/tesseract-ocr/tesseract#tesseract-ocr), big
players like Google and Microsoft provide OCR as a service with a reasonable
price so we don't have to worry about managing & monitoring our own boxes and
fine tuning tesseract configs.

Another aspect to this is the fact that Serenata de amor is
[crowdfunded](https://apoia.se/serenata), which (as of today) means having a
small team / budget to keep their infra going and also means not having a person
to work on it in a daily basis.

In terms of $, some initial estimates I made showed that it'd cost less than 100
dollars total to have a serverless API handling OCR of the 20k+ receipts
submitted by deputies each month (mostly the Google Cloud Vision API bill).
Imagine how much we'd pay for running a set of beefy boxes to handle the OCR
work which for long periods of time would just sit idle. Also consider the fact
that at the end of the day, those third party services are probably going to do
a better job than us.

## How did it go?

Instead of dealing with the nitty gritty of configuring and deploying a
"Serverless API" I decided to explore this new world by leveraging tools that
automate processes and reduce the boilerplate required to get up and running.

From what I've heard, the most popular tools seem to be the [Serverless
Framework](http://serverless.com/) and [Claudia.JS](https://claudiajs.com/):

* "The Serverless Framework is a CLI tool that allows users to build & deploy
auto-scaling, pay-per-execution, event-driven functions", supporting 7 different
cloud providers (as of today).
* Claudia.JS is a simpler tool with a focus on deploying Node.js projects to AWS
Lambda.


### 1st try

While serverless was new to me, the "OCR with Google Cloud Vision API" part
[wasn't](https://github.com/datasciencebr/serenata-de-amor/blob/master/research/develop/2016-12-30-fgrehm-ocr-receipts-with-google-cloud-vision.ipynb).
I've been able to OCR [nearly 200k receipts
already](https://github.com/datasciencebr/serenata-de-amor/blob/master/docs/receipts-ocr.md)
so my first approach to the problem was convert the [Python code I previously
wrote](https://gist.github.com/fgrehm/d3612ee6a84fc74e4595e52078040d46) into a
serverless function. Google provides support for that so I chose to stick to the
Serverless CLI and use [Google Cloud
Function](https://cloud.google.com/functions/) in order to reduce the network
latency between hosts.

The original plan was to have a client provide the reimbursement id and let my
new API handle all the rest, meaning it'd load the reimbursements CSV (containing
_all_ of the reimbursements submitted), identify the reimbursement and use the
additional data it provides to build an URL, download and OCR the receipt.

Reading the CSV and doing the reimbursement lookup reusing the code I had meant
using Python's [pandas](http://pandas.pydata.org/) and
[numpy](http://www.numpy.org/) under the hood, relying on native extensions in
order for things to work. That's when things started getting hairy.

These days my main dev environment is a MacBook and the cloud function runs on
Linux. In order to cross compile extensions for deployment I used to a
[plugin](https://github.com/UnitedIncome/serverless-python-requirements#serverless-python-requirements)
that deals with compiling the code in a docker container that resembles the
function env. The plug-in seems to work but the problem I faced after that was the
fact that my function's resulting pkg was too big to be deployed due to the
native extensions and the CSV.

Thankfully that didn't work that well, in hindsight, I realized that it was a
lot for something that is supposed to be lightweight and short lived.

### 2nd try

With pandas out of the equation, I decided to switch to a simpler approach using
node.js, still attempting a deployment to a Google Cloud Function to reduce
network latency and using the Serverless CLI for the heavy lifting.

The idea would be to keep the additional reimbursement information lookup for
downloading receipts in the client so the function did not have to read a
large dataset to grab a handful of values to build the download URL. In other
words, instead of hitting an endpoint like `/ocr/<reimbursement_id>`, clients
would hit `/ocr/<applicant_id>/<year>/<reimbursement_id>`.

This went fine until the point I had to convert a PDF into a PNG image to be
sent over to the Cloud Vision API.

I originally used [popplerutils](https://poppler.freedesktop.org/) to handle the
convertion but no serverless function has that tool in their default stack. I
tried using [pdfjs](https://github.com/mozilla/pdf.js/#pdfjs) to handle that but
[that also didn't work](https://github.com/mozilla/pdf.js/issues/8489).

After some digging I found out that [ImageMagick](http://www.imagemagick.org/)
can do that and it is available in the Google Cloud Function stack. I got this
part of the process working locally but it failed in "production". Turns out
that for ImageMagick to handle the PDF to PNG conversion it needs to have
[Ghostscript](https://www.ghostscript.com/) available and later I found out that
it got out of the [cloud function stack](https://stackoverflow.com/a/45105954).

### 3rd try

As you might've guessed, I eventually gave up on Google Functions and moved on
to AWS Lambda. Along with that I chose to use ClaudiaJS since it seemed like a
simpler tool and more focused on the Node.js + Lambda combo.

I eventually got things working with the official Node.js [Cloud Vision API
Client](https://www.npmjs.com/package/@google-cloud/vision). locally but (again)
it failed on Lambda. This time I tracked it down to the fact that the official
npm pkg for cloud vision uses [gRPC](https://grpc.io/) under the hood, which
requires some native extensions as well.

I tried Docker to compile extensions using the
[`lambci/lambda`](https://github.com/lambci/docker-lambda) image but for
whatever reason it also didn't work. After some debugging and digging through
AWS's UI I noticed the function size increased quite a lot (about 20MB+ IIRC)
and realized that things could actually be made simpler.

### 4th and last try

The Cloud Vision API has a rest interface that can be easily used with simple
HTTP clients. While gRPC is probably more efficient, HTTP also gets the job done
so I adapted my original Python code to JS using
[`node-fetch`](https://github.com/bitinn/node-fetch) and called it a day. I
still had to bump the function's memory to 1Gb to handle big documents (6+
pages) and "massage" ImageMagick parameters to handle some corner cases but I
eventually managed to get a proof of concept that worked for all the initial
tests I made.

The code is available in [GitHub](https://github.com/fgrehm/serenata-ocr) and I
already have some ideas of next steps documented in the [issue
tracker](https://github.com/fgrehm/serenata-ocr/issues). Here's a quick demo of
going from zero to OCR in a close to a minute:

<script type="text/javascript" src="https://asciinema.org/a/149404.js" id="asciicast-149404" async></script>
<noscript>
  <center>
    <img src="https://user-images.githubusercontent.com/81859/33225931-5ccaed5e-d168-11e7-97b3-14f9f5d6f58c.gif" alt="serenata-ocr-demo" />
  </center>
</noscript>


## TL;DR

The problem of _deploying_ applications that leverages Serverless
infrastructures seems to be nicely handled by tools like the Serverless Framework
CLI and Claudia.JS. While that can save us a bunch of time, given the issues
outlined above I believe that deployment is going to be a small effort of your
Serverless endeavours.

In my opinion and based on this initial experience, the most important things to
watch out is function's package sizes, making sure they have the bare minimum
set of responsibilities it can, and the packages our apps rely on since they can
become a big PITA to get working in prod.

Finally, my main recommendation to people trying out Serverless architectures
for the first time is to approach the problems you're trying to solve embracing
eXtreme Programming's baby steps and don't go too far with "Works in my machine"
:)

---
layout: post
title: 'Getting to know BTRFS'
description: 'AKA why lxc-clone will be the next "big thing" on vagrant-lxc'
tags:
- vagrant
- lxc
- btrfs
- copy on write
category: blog
---

NO THOUGHTS!
RENAME TO: BTRFS + lxc-clone = <3 (or why lxc-clone will be the next "big thing" on vagrant-lxc)'

http://s3hh.wordpress.com/2013/05/02/lxc-improved-clone-support/


While trying out [Docker](http://docker.io) I came across [AUFS](http://aufs.sourceforge.net/aufs.html)
and its [Copy On Write](http://en.wikipedia.org/wiki/Copy-on-write) capabilities,
I've also happen to watch the [project](https://github.com/dotcloud/docker) on
GitHub and got to know [BTRFS](http://en.wikipedia.org/wiki/Btrfs) a while ago
because of this [GitHub issue](https://github.com/dotcloud/docker/issues/443) on
Docker's issue tracker + [this bug](https://github.com/fgrehm/vagrant-lxc/issues/81)
filled for vagrant-lxc. After playing a bit more with Docker I went ahead and
started looking around to understand what a Copy On Write File System really
means and thought that it would be nice to share my initial findings.

## What's with Copy on Write (aka COW)?

Some googling pointed me to [this comprehensive](http://faif.objectis.net/download-copy-on-write-based-file-systems)
thesis on Copy On Write Based File Systems by Sakis Kasampalis and while I havent
read the whole thesis yet, I found this pretty nice definition about COW on
page 19:

> COW generally follows a simple principle. As long as multiple programs need
> read only access to a data structure, providing them only pointers which
> point to the same data structure, instead of copying the whole structure to
> a new one, is enough.

If you've never heard of COW take the time to grasp those words and think about
applying that to a File System (if you are more of a [visual person](http://en.wikipedia.org/wiki/Visual_learning),
check [this](http://www.funtoo.org/BTRFS_Fun#A_story_of_boxes....)
out).

Going further, Kasampalis writes:

> If at least one of the programs needs at some point
> write access to the data structure, create a private copy for it. The same holds
> for each one of the programs which will need write access to the data structure.
> A new private copy will be created for them. Let's assume that we have an
> array data structure called "foo", and two programs called "Bob"
> and "Alice" which need to access it in read/write mode. If during the access,
> none of the programs tries to change the contents of "foo", both "Bob" and
> "Alice" will actually use exactly the same "foo" array. If at some point "Bob"
> changes the contents of "foo", a private copy of the changed data of "foo" will
> automatically be created by the COW system and provided to "Bob". Note
> that the unchanged data can still be shared between "Bob" and "Alice". This
> is a powerful feature of COW.

He also highlights the benefits of COW file systems on page 20:

> I believe that COW's major contributions to file systems are the support for (1)
> taking cheap snapshots, (2) ensuring both data and metadata consistency and
> integrity with acceptable performance.

As another COW example, we have [Ruby Enterprise Edition](http://www.rubyenterpriseedition.com/faq.html#what_is_this),
that shipped with a "copy-on-write friendly garbage collector, capable of reducing
Ruby on Rails applications’ memory usage by 33% on average" and had its EOL
anounced once a copy-on-write patch was checked into Ruby 2.0. For other use
cases please refer to [Wikipedia](http://en.wikipedia.org/wiki/Copy-on-write#Other_applications_of_copy-on-write).

## B-tree data structure

If you forgot about your data structure lessons, here's the definition from [Wikipedia](http://en.wikipedia.org/wiki/B-tree):

> In computer science, a B-tree is a tree data structure that keeps data sorted and
> allows searches, sequential access, insertions, and deletions in logarithmic time.
> The B-tree is a generalization of a binary search tree in that a node can have more
> than two children. (Comer 1979, p. 123) Unlike self-balancing binary search trees,
> the B-tree is optimized for systems that read and write large blocks of data.
> It is commonly used in databases and filesystems.

## B-tree file system (aka BTRFS)

From [Wikipedia](http://en.wikipedia.org/wiki/Btrfs) again:

> Btrfs \[...\] is a GPL-licensed experimental copy-on-write file system for Linux.
> \[...\] Btrfs is intended to address the lack of pooling, snapshots, checksums
> and integral multi-device spanning in Linux file systems, these features being
> crucial as Linux use scales upward into the larger storage configurations common
> in enterprise. Chris Mason, the principal Btrfs author, has stated that its goal
> was "to let Linux scale for the storage that will be available. Scaling is not
> just about addressing the storage but also means being able to administer and
> to manage it with a clean interface that lets people see what's being used and
> makes it more reliable."

Although it looks pretty exciting from outside when you play with it, there are
some things to keep in mind:

> It is still in heavy development and marked as unstable. Especially when the
> filesystem becomes full, no-space conditions arise which might make it
> challenging to delete files.

## Trying it out (aka "What it means for vagrant-lxc?")

Enough theory and copy and pasting! Because an [Asciicast](http://ascii.io/) is
worth more than a thousand words, check out the one below. I used [this Vagrantfile](https://gist.github.com/fgrehm/b07c6370a710be622807)
to fire up a VBox machine ready to rock, a V3 base box and a custom built
vagrant-lxc from the V3 boxes branch to record the asciicast:


CHECK IF GUARD WILL WORK


MENTION RARING!!!!!


<div class="asciicast">
  <div>
    <iframe src="http://ascii.io/a/3490/raw" frameborder="0"></iframe>
  </div>
  <p>
    You can find out more about and play with BTRFS by looking at
    <a href="http://www.funtoo.org/BTRFS_Fun">this entry</a> from
    <a href="http://www.funtoo.org/wiki/Welcome">Funtoo Linux</a> Wiki.
  </p>
</div>

So can you guess what does that mean for vagrant-lxc? Basically even faster container
creation times as you probably noticed that `lxc-clone` + BTRFS snapshotting was pretty
fast (under 1 second). It also means support for container [snapshots](https://github.com/fgrehm/vagrant-lxc/issues/32)
should be easier to implement while keeping disk usage pretty low.

## Coming up

I've only done some initial experiments with BTRFS and I have no idea how it behaves
on the wild but I'm willing to add some experimental support for `lxc-clone` in a
future vagrant-lxc version. I'm not really sure how that will look like but on
the spirit of eating my own dog food I'll create a BTRFS partition on my physical
HD to see how it goes.

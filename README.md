# OpenShift template for Vert.x applications

Template for running [Vert.x](https://github.com/sdellang/vertx-openshift) applications on OpenShift. Updated for vert.x 2.0.x.

## What it does?

* The demo currently runs the Vert.x webapp demo - which is a shop webapp that uses MongoDB at the back-end

## Configuration

is in .openshift/config.example

## Lifecycle hooks

are in .openshift/action_hooks

## All the rest of the stuff

It uses a simple server in java stored in the http directry.

Replace this with your app and update $SERVER_FILE on config.example

## How to create your app (with name $name)

Create OpenShift application

	rhc app create -a $name -t diy-0.1

This will create a new git repo for your application

and enter the directory

	cd $name

Add _this_ repository as new remote

	git remote add template -m master https://github.com/sdellang/vertx-openshift.git

and pull locally

	git pull -s recursive -X theirs template master

and deploy to OpenShift

	git push origin master

Now, your application is available at

	http://$name-$namespace.rhcloud.com

## Notes for Ruby, Python

If you want to write Ruby or Python applications with Vert.x you will have to install
JRuby and/or Jython in your application and set the env vars JRUBY_HOME and JYTHON_HOME to point
to those installations.

Take a look how we install vert.x in the script .openshift/action_hooks/pre_build for an idea of how to do that.



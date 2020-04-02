# The SWITCH scalable Jitsi Installation

22.3.2020

SWITCH is the Swiss National Research and Network (NREN) and provides various IT services
to Swiss higher education institutions. This ansible playbook is used to set up
a cluster of individual Jitsi Frontend servers (one for each insitiution) that share a
pool of videobridges. This is a brand new service that was started during the Covid19 crisis
in March 2020. A service description can be found at https://switch.ch/meet

This repository is provided **AS IS** under a MIT license without any implicit or explicit guarantees
that it will work for you.

The setup is geared towards our needs and will most likely not work out of the box for you.

Things to look out for:

* We provision VMs on our internal IaaS cloud SWITChengines (https://switch.ch/engines) using the
  `build*servers` playbooks. You will need to adapt that to your environment
* We use an internal ansible role (`users`) that provisions our admin users onto our VMs. You will
  need to roll your own. For now, remove the `users` role entry in `provision.yml`
* We use Ubuntu 18.04 as a base operating system. No other configurations have been or will be tested
* We use Shibboleth Authentication. If you are not part of the universities, chances are you will not
  need to know how that works. Remove the `shib` role entry in `provision.yml`
* We use https://site24x7.com for monitoring. The playbook sets up automatic server monitoring. Again,
  remove the `site24x7` role from `provision.yml`

Create your own directories for `group_vars`, `hosts_vars` and `inventory`
Or use the ansible-galaxy approach, then use

    $ cd ansible
    $ ansible-galaxy install -fr roles/requirements.yml


## Adding a new service VM (this is very SWITCH specific)

The building process was automated while deploying the different instances.


Initially, change `jitsi-ORGANISATION` in `build_jitsi_server.yml`.

Source the corresponding project, use `openrc.sample` as a guidance.

    $ ansible-playbook build_jitis_server.yml -D

Note the new host into `inventory/production`! Append `ansible_user=ubuntu` for the first run. Then you have to copy `host_vars/template.meet.example.com` folder, to `ORGANISATION.meet.switch.ch` and change the values such as SSL cert (normally a Quovadis Cert), callstat.io credentials. Also think about `shibboleth`. Shall it be enabled?! If yes, set `jitsi_shib: yes` in vars.yml.
**Note:** The callstats credentials can be requested in [callstats.io](https://dashboard.callstats.io/apps/687063655/home).

* Ask for DNS entry `name-of-uni.meet.switch.ch` with IPv4 & IPv6 info
* Special Parameters:
  * Shibboleth Entity (same as Hostname)
  * WAYF - use https://www.switch.ch/aai/participants/allhomeorgs-expert/ to find it

When all values are filled out (except of the shib-cert and shib-key), you can run:

    $ ansible-playbook -i inventory/production main.yml --limit new_host.meet.example.com

You can limit the playbook runs to specific tasks with the following tags:

* `conf` - only deploy configuration changes (and restart services where necessary)
* `webconf` - only deploy the web config of jitsi-meet (no service disruption)
* `nginx` - only install/configure Nginx
* `jitsi` - only install/configure Jitsi
* `shib` - only install/configure Shibboleth

Example:

    $ ansible-playbook -i inventory/production main.yml --limit new.host.meet.ch --tags conf

If shiboleth is enabled then you have to request an RR:
* login to the server and get the fingerprint of the AAI Shib certificate and `/etc/shibboleth/sp-cert.pem`  
  `openssl x509 -in /etc/shibboleth/sp-cert.pem -fingerprint -sha1 -noout`
* copy the `sp-cert.pem` and `sp-key.pem` to your local machine and add them to the host_var and the vault respectively
* create the RR request at https://rr.aai.switch.ch
  * Name: hostname
  * Entity ID: hostname
  * Home Org: SWITCH
  * Description: "VideoConf service for UNI provided by SWITCH"
  * For support contacts:
    * FirstName: support
    * LastName: support
    * mail: support@switch.ch
  * Attributes:
    * Required: mail, firstname, givename, uniqueid
  * Audience:
    * Limit to the requesting organisation
    * exclude the EduID
  * Paste the Fingerprint into the comment field at the end    
* wait for the approval.

Done. You should have a new host for the specific organisation.

**Note:** The videobridges have to be newly configured such that they get the new configuration. (They have to authenticate to the MUC on the new server. Until then, no meetings are possible.) This can be done with:

    $ ansible-playbook -i inventory/production main.yml --limit videobridge -D

**Caution:** This will restart all Videobridges such that it should be run during a maintenance window.

## Add a new videobridge server

### switch-net

The new [Transform's switch-net](https://gitlab-int.switch.ch/transform/transform-net) gives us unNATed, unfiltered IP addresses (IPv4 and IPv6) in the SWITCH network ranges.

The `switch-net` were add to the `videobridges.meet.switch.ch` project in ZH and LS as decribed in [Self-Service Port Allocation](https://gitlab-int.switch.ch/transform/transform-net#self-service-port-allocation)

### Create and provision videobridge server

Source credentials of the `videobridges.meet.switch.ch` project!

* Add new entry in `inventory/production` in the section `videobridge`.
* Run the following command to build:
**Important:** Please comment out the existing Videobridge servers in order to speed up the build process!

    $ ansible-playbook build_videobridge_servers.yml -D

* Write the IPs in `inventory/production` in the section `videobridge`
* Assure that you filled in the `callstats.io` credentials in `group_vars/videobrdiges/vars.yml`
* Execute the following playbook:

    $ ansible-playbook -i inventory/production main.yml -e ansible_user=ubuntu --limit jitsi-videobridge-XXXX.videobridges.meet.switch.ch


## Add jibri service
There is a build script which deploys new jibri servers. **Please comment out the existing servers!**
Source the project's `.openrc` file and run:

    $ ansible-playbook -i inventory/test build_jibri_server.yml -DC

This script loops over the `jibri` group and creates new hosts in the given project.

## Purge Services

While installing and trying to get things working, you might want to purge all traces of
*nginx* or *jitsi* from your servers. Use the `purge.yml` playbook like so:

    $ ansible-playbook -i inventory/production purge.yml --limit ORGANISATION.meet.example.com

Specify one (or more of the following tags) with `--tags ...`
  * `nginx` - remove nginx from server
  * `jitsi` - remove all traces of jitsi / prosody etc from the server
  * `jicofolog` - truncate the jicofo logs

## Attribution

The Jitsi Ansible role is heavily influenced by https://github.com/freedomofpress/ansible-role-jitsi-meet

## License
MIT Licence

Copyright 2020 SWITCH, https://switch.ch

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

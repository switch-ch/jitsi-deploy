#!/bin/bash

#ORGANISATIONS="jitsi-org1 jitsi-org2"
ORGANISATIONS=$1

for host in ${ORGANISATIONS}; do
  echo "openstack server add security group ${host} 'http(s)'"
  openstack server add security group $host 'http(s)'
  sleep 1
  echo "openstack server add security group ${host} 'jitsi-meet'"
  openstack server add security group $host 'jitsi-meet'
  sleep 1
  echo "openstack server remove security group ${host} 'jitsi'"
  openstack server remove security group $host 'jitsi'
done

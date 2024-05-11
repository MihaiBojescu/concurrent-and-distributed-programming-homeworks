FROM dockurr/dnsmasq:2.90

RUN echo "address=/application.local/10.0.0.3" >> /etc/dnsmasq.conf
RUN echo "address=/application.local/10.0.0.5" >> /etc/dnsmasq.conf

ENTRYPOINT ["/bin/sh", "-c", "/usr/bin/dnsmasq.sh"]

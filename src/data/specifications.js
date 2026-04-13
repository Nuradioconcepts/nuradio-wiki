// Specifications data for the Resources page.
// Each category has series; each series has specs.
// `matchSpec` is a function used to test whether a glossary term's spec string belongs here.

export const specificationsData = [
  // ─────────────────────────────────────────────────────────────────────────────
  // 3GPP
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: '3gpp',
    name: '3GPP',
    icon: '📡',
    series: [
      {
        id: '22-series',
        name: '22 Series',
        description: 'Service Requirements',
        specs: [
          {
            id: 'ts-22-261',
            number: 'TS 22.261',
            title: 'Service requirements for the 5G system',
            topics: ['eMBB', 'URLLC', 'mMTC', 'Network Slicing', 'QoS'],
            matchSpec: (s) => s.includes('22.261'),
          },
        ],
      },
      {
        id: '23-series',
        name: '23 Series',
        description: 'Technical Realization & Architecture',
        specs: [
          {
            id: 'ts-23-003',
            number: 'TS 23.003',
            title: 'Numbering, addressing and identification',
            topics: ['SUPI', 'SUCI', '5G-GUTI', 'PLMN ID', 'IMSI', 'RNTI', 'NSSAI', 'DNN', 'Cell ID', 'TAC'],
            matchSpec: (s) => s.includes('23.003'),
          },
          {
            id: 'ts-23-228',
            number: 'TS 23.228',
            title: 'IP Multimedia Subsystem (IMS) — Stage 2',
            topics: ['IMS', 'VoNR', 'SIP', 'P-CSCF', 'S-CSCF'],
            matchSpec: (s) => s.includes('23.228'),
          },
          {
            id: 'ts-23-501',
            number: 'TS 23.501',
            title: '5G System Architecture — Stage 2',
            topics: ['AMF', 'SMF', 'UPF', 'PCF', 'UDM', 'AUSF', 'NRF', 'Network Slicing', 'QoS Framework', 'N1–N9 Interfaces', 'Service-Based Architecture'],
            matchSpec: (s) => s.includes('23.501'),
          },
        ],
      },
      {
        id: '24-series',
        name: '24 Series',
        description: 'Core Network & Terminals (Non-Access Stratum)',
        specs: [
          {
            id: 'ts-24-501',
            number: 'TS 24.501',
            title: 'Non-Access-Stratum (NAS) protocol for 5G System (5GS)',
            topics: ['5GMM', '5GSM', 'Registration', 'Authentication', 'Security Mode Command', 'PDU Session Establishment', 'Deregistration', 'RM States', 'CM States'],
            matchSpec: (s) => s.includes('24.501'),
          },
        ],
      },
      {
        id: '29-series',
        name: '29 Series',
        description: 'Core Network Protocols (Stage 3)',
        specs: [
          {
            id: 'ts-29-281',
            number: 'TS 29.281',
            title: 'General Packet Radio System (GPRS) Tunnelling Protocol User Plane (GTPv1-U)',
            topics: ['GTP-U', 'Tunnel Endpoint ID (TEID)', 'PDU Forwarding', 'N3 Interface', 'F1-U Interface'],
            matchSpec: (s) => s.includes('29.281'),
          },
          {
            id: 'ts-29-500',
            number: 'TS 29.500',
            title: '5G Core Network — Service Framework (SBI)',
            topics: ['Service-Based Interface', 'HTTP/2', 'JSON', 'OpenAPI', 'NF Service Registration', 'NRF'],
            matchSpec: (s) => s.includes('29.500'),
          },
        ],
      },
      {
        id: '31-series',
        name: '31 Series',
        description: 'USIM / Terminal Interface',
        specs: [
          {
            id: 'ts-31-102',
            number: 'TS 31.102',
            title: 'Characteristics of the Universal Subscriber Identity Module (USIM) application',
            topics: ['USIM', 'SUPI', 'K (subscriber key)', 'EF files', 'SIM provisioning'],
            matchSpec: (s) => s.includes('31.102'),
          },
        ],
      },
      {
        id: '33-series',
        name: '33 Series',
        description: 'Security',
        specs: [
          {
            id: 'ts-33-501',
            number: 'TS 33.501',
            title: 'Security architecture and procedures for 5G System',
            topics: ['5G-AKA', 'EAP-AKA\'', 'SUCI Concealment', 'NAS Security', 'AS Security', 'Key Hierarchy (KAUSF, KAMF, KgNB)', 'AUSF', 'Integrity Protection', 'Ciphering'],
            matchSpec: (s) => s.includes('33.501'),
          },
        ],
      },
      {
        id: '36-series',
        name: '36 Series',
        description: 'LTE / Evolved UTRAN (for reference)',
        specs: [
          {
            id: 'ts-36-211',
            number: 'TS 36.211',
            title: 'LTE — Physical channels and modulation',
            topics: ['LTE Physical Layer', 'OFDM', 'Reference Signals', 'PDSCH', 'PUSCH'],
            matchSpec: (s) => s.includes('36.211'),
          },
        ],
      },
      {
        id: '37-series',
        name: '37 Series',
        description: 'Multiple Radio Access Technology (Multi-RAT)',
        specs: [
          {
            id: 'ts-37-324',
            number: 'TS 37.324',
            title: 'Service Data Adaptation Protocol (SDAP) specification',
            topics: ['SDAP', 'QoS Flow', 'QFI', 'DRB Mapping', 'User Plane'],
            matchSpec: (s) => s.includes('37.324'),
          },
        ],
      },
      {
        id: '38-series',
        name: '38 Series',
        description: '5G New Radio (NR)',
        specs: [
          {
            id: 'ts-38-101-1',
            number: 'TS 38.101-1',
            title: 'NR — UE radio transmission and reception; Part 1: Range 1 Standalone (FR1)',
            topics: ['FR1 Bands', 'UE RF Requirements', 'Channel Bandwidth', 'Sub-6 GHz', 'NR Band Table'],
            matchSpec: (s) => s.includes('38.101-1'),
          },
          {
            id: 'ts-38-101-2',
            number: 'TS 38.101-2',
            title: 'NR — UE radio transmission and reception; Part 2: Range 2 Standalone (FR2)',
            topics: ['FR2 Bands', 'mmWave', 'UE RF Requirements', 'Beamforming'],
            matchSpec: (s) => s.includes('38.101-2'),
          },
          {
            id: 'ts-38-104',
            number: 'TS 38.104',
            title: 'NR — Base Station (BS) radio transmission and reception',
            topics: ['gNB RF Requirements', 'EIRP', 'EVM', 'Output Power', 'FR1/FR2'],
            matchSpec: (s) => s.includes('38.104'),
          },
          {
            id: 'ts-38-211',
            number: 'TS 38.211',
            title: 'NR — Physical channels and modulation',
            topics: ['OFDM Numerology', 'Subcarrier Spacing', 'Slot Structure', 'PDSCH', 'PUSCH', 'PDCCH', 'PUCCH', 'PBCH', 'PRACH', 'Reference Signals (DMRS, PTRS, CSI-RS, SRS)'],
            matchSpec: (s) => s.includes('38.211') && !s.includes('38.211–'),
          },
          {
            id: 'ts-38-212',
            number: 'TS 38.212',
            title: 'NR — Multiplexing and channel coding',
            topics: ['LDPC', 'Polar Codes', 'CRC', 'Rate Matching', 'DCI Formats', 'UCI'],
            matchSpec: (s) => s.includes('38.212'),
          },
          {
            id: 'ts-38-213',
            number: 'TS 38.213',
            title: 'NR — Physical layer procedures for control',
            topics: ['DCI', 'PDCCH Search Space', 'Beam Management', 'Uplink Power Control', 'PUCCH Procedures', 'RA-RNTI'],
            matchSpec: (s) => s.includes('38.213'),
          },
          {
            id: 'ts-38-214',
            number: 'TS 38.214',
            title: 'NR — Physical layer procedures for data',
            topics: ['MCS', 'CQI', 'PMI', 'RI', 'Link Adaptation', 'HARQ', 'CSI Reporting', 'TBS Calculation'],
            matchSpec: (s) => s.includes('38.214'),
          },
          {
            id: 'ts-38-300',
            number: 'TS 38.300',
            title: 'NR and NG-RAN Overall Description — Stage 2',
            topics: ['gNB Architecture', 'CU/DU Split', 'NG-RAN Interfaces', 'UE States', 'Mobility', 'RAN Functions Overview'],
            matchSpec: (s) => s.includes('38.300'),
          },
          {
            id: 'ts-38-304',
            number: 'TS 38.304',
            title: 'NR — User Equipment (UE) procedures in Idle mode and in RRC Inactive state',
            topics: ['Cell Selection', 'Cell Reselection', 'PLMN Selection', 'RRC Idle', 'RRC Inactive', 'Camping'],
            matchSpec: (s) => s.includes('38.304'),
          },
          {
            id: 'ts-38-321',
            number: 'TS 38.321',
            title: 'NR — Medium Access Control (MAC) protocol specification',
            topics: ['MAC PDU', 'HARQ', 'BSR', 'SR', 'TA Command', 'Logical Channel Prioritization', 'C-RNTI', 'Random Access', 'DRX', 'Scheduling'],
            matchSpec: (s) => s.includes('38.321'),
          },
          {
            id: 'ts-38-322',
            number: 'TS 38.322',
            title: 'NR — Radio Link Control (RLC) protocol specification',
            topics: ['RLC TM', 'RLC UM', 'RLC AM', 'ARQ', 'Segmentation', 'RLC PDU', 'Status Report'],
            matchSpec: (s) => s.includes('38.322'),
          },
          {
            id: 'ts-38-323',
            number: 'TS 38.323',
            title: 'NR — Packet Data Convergence Protocol (PDCP) specification',
            topics: ['PDCP SDU', 'Header Compression (RoHC)', 'Ciphering', 'Integrity', 'PDCP SN', 'Reordering', 'Duplication'],
            matchSpec: (s) => s.includes('38.323'),
          },
          {
            id: 'ts-38-331',
            number: 'TS 38.331',
            title: 'NR — Radio Resource Control (RRC) protocol specification',
            topics: ['RRC Setup', 'SRB', 'DRB', 'MeasConfig', 'Handover', 'RRC Reconfiguration', 'System Information (SIB)', 'Cell Selection', 'RRC States'],
            matchSpec: (s) => s.includes('38.331'),
          },
          {
            id: 'ts-38-401',
            number: 'TS 38.401',
            title: 'NG-RAN Architecture Description',
            topics: ['gNB-CU', 'gNB-DU', 'gNB-CU-CP', 'gNB-CU-UP', 'F1 Split', 'E1 Split', 'Xn Interface', 'NG Interface', 'Functional Split Options'],
            matchSpec: (s) => s.includes('38.401'),
          },
          {
            id: 'ts-38-413',
            number: 'TS 38.413',
            title: 'NG Application Protocol (NGAP)',
            topics: ['NGAP', 'N2 Interface', 'Initial Context Setup', 'UE Context', 'Paging', 'PDU Session Resource Setup', 'Handover Signaling'],
            matchSpec: (s) => s.includes('38.413'),
          },
          {
            id: 'ts-38-420',
            number: 'TS 38.420',
            title: 'NG-RAN — Xn general aspects and principles',
            topics: ['Xn Interface', 'gNB-gNB Communication', 'Xn-C', 'Xn-U'],
            matchSpec: (s) => s.includes('38.420'),
          },
          {
            id: 'ts-38-423',
            number: 'TS 38.423',
            title: 'Xn Application Protocol (XnAP)',
            topics: ['XnAP', 'Xn Setup', 'Handover Request', 'SN Addition', 'Cell Activation'],
            matchSpec: (s) => s.includes('38.423'),
          },
          {
            id: 'ts-38-460',
            number: 'TS 38.460',
            title: 'NG-RAN — E1 interface general aspects and principles',
            topics: ['E1 Interface', 'gNB-CU-CP to gNB-CU-UP', 'Bearer Context'],
            matchSpec: (s) => s.includes('38.460'),
          },
          {
            id: 'ts-38-463',
            number: 'TS 38.463',
            title: 'E1 Application Protocol (E1AP)',
            topics: ['E1AP', 'Bearer Context Setup', 'Bearer Context Modification', 'gNB-CU-CP', 'gNB-CU-UP'],
            matchSpec: (s) => s.includes('38.463'),
          },
          {
            id: 'ts-38-470',
            number: 'TS 38.470',
            title: 'NG-RAN — F1 interface general aspects and principles',
            topics: ['F1 Interface', 'F1-C', 'F1-U', 'gNB-CU to gNB-DU'],
            matchSpec: (s) => s.includes('38.470'),
          },
          {
            id: 'ts-38-473',
            number: 'TS 38.473',
            title: 'F1 Application Protocol (F1AP)',
            topics: ['F1AP', 'F1 Setup', 'UE Context Setup', 'DL/UL RRC Message Transfer', 'gNB-DU Configuration Update'],
            matchSpec: (s) => s.includes('38.473'),
          },
          {
            id: 'ts-38-474',
            number: 'TS 38.474',
            title: 'NG-RAN — F1 data transport',
            topics: ['F1-U', 'GTP-U over F1', 'User Plane Transport', 'TEID'],
            matchSpec: (s) => s.includes('38.474'),
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // O-RAN Alliance
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'o-ran',
    name: 'O-RAN Alliance',
    icon: '🔗',
    series: [
      {
        id: 'wg1',
        name: 'WG1 — Use Cases & Overall Architecture',
        description: 'Overall O-RAN architecture, use cases, and high-level design',
        specs: [
          {
            id: 'o-ran-wg1-arch',
            number: 'O-RAN.WG1',
            title: 'O-RAN Architecture Description',
            topics: ['O-RAN Architecture', 'O-DU', 'O-RU', 'O-CU', 'SMO', 'Near-RT RIC', 'Non-RT RIC', 'Open Interfaces', 'O-RAN Use Cases'],
            matchSpec: (s) => s.includes('WG1'),
          },
        ],
      },
      {
        id: 'wg2',
        name: 'WG2 — Non-RT RIC & A1 Interface',
        description: 'Non-Real-Time RAN Intelligent Controller and A1 interface',
        specs: [
          {
            id: 'o-ran-wg2-a1gap',
            number: 'O-RAN.WG2.A1GAP',
            title: 'A1 General Aspects and Principles',
            topics: ['A1 Interface', 'Non-RT RIC', 'AI/ML Policy', 'Enrichment Information', 'RAN Analytics'],
            matchSpec: (s) => s.includes('WG2'),
          },
        ],
      },
      {
        id: 'wg3',
        name: 'WG3 — Near-RT RIC & E2 Interface',
        description: 'Near-Real-Time RAN Intelligent Controller and E2 interface',
        specs: [
          {
            id: 'o-ran-wg3-e2ap',
            number: 'O-RAN.WG3.E2AP',
            title: 'E2 Application Protocol (E2AP)',
            topics: ['E2 Interface', 'Near-RT RIC', 'E2 Setup', 'RIC Subscription', 'RIC Control', 'E2 Node', 'KPM Service Model'],
            matchSpec: (s) => s.includes('WG3'),
          },
        ],
      },
      {
        id: 'wg4',
        name: 'WG4 — Open Fronthaul',
        description: 'Open fronthaul interface (CUS plane, Management plane)',
        specs: [
          {
            id: 'o-ran-wg4-cus',
            number: 'O-RAN.WG4.CUS',
            title: 'Control, User and Synchronization (CUS) Plane Specification',
            topics: ['Open Fronthaul', 'eCPRI', 'C-Plane', 'U-Plane', 'S-Plane', 'Beamforming', 'Category A/B', 'O-DU / O-RU Split', 'IEEE 1588 PTP', 'SyncE'],
            matchSpec: (s) => s.includes('WG4'),
          },
        ],
      },
      {
        id: 'wg5',
        name: 'WG5 — O-DU / O-CU Interfaces',
        description: 'Open F1 / W1 / E1 / X2 interfaces between O-DU and O-CU',
        specs: [
          {
            id: 'o-ran-wg5-f1',
            number: 'O-RAN.WG5',
            title: 'O-DU to O-CU Interface Specifications (F1, E1)',
            topics: ['F1 Interface', 'E1 Interface', 'O-DU', 'O-CU-CP', 'O-CU-UP', 'F1AP', 'E1AP'],
            matchSpec: (s) => s.includes('WG5'),
          },
        ],
      },
      {
        id: 'wg6',
        name: 'WG6 — Cloudification & O-Cloud',
        description: 'O-Cloud infrastructure, virtualization, and cloud-native RAN',
        specs: [
          {
            id: 'o-ran-wg6-cloud',
            number: 'O-RAN.WG6',
            title: 'O-Cloud Architecture and Deployment Scenarios',
            topics: ['O-Cloud', 'Containerization', 'Kubernetes', 'VMs', 'O2 Interface', 'CCIN', 'DMS', 'IMS', 'LCM', 'Hardware Acceleration'],
            matchSpec: (s) => s.includes('WG6'),
          },
        ],
      },
      {
        id: 'wg7',
        name: 'WG7 — White-box Hardware',
        description: 'Hardware reference designs for O-RAN white-box platforms',
        specs: [
          {
            id: 'o-ran-wg7-hw',
            number: 'O-RAN.WG7',
            title: 'White-box Hardware Reference Designs',
            topics: ['White-box Hardware', 'O-DU Hardware', 'O-RU Hardware', 'FHGW', 'Reference Platform', 'FPGA/ASIC', 'PCIe Accelerator'],
            matchSpec: (s) => s.includes('WG7'),
          },
        ],
      },
      {
        id: 'wg9',
        name: 'WG9 — X-Haul Transport',
        description: 'Fronthaul, midhaul, and backhaul transport networking',
        specs: [
          {
            id: 'o-ran-wg9-xhaul',
            number: 'O-RAN.WG9',
            title: 'X-Haul Transport Architecture and Solutions',
            topics: ['X-Haul', 'Fronthaul', 'Midhaul', 'Backhaul', 'Transport Network', 'VLAN', 'QoS', 'Synchronization', 'DetNet'],
            matchSpec: (s) => s.includes('WG9'),
          },
        ],
      },
      {
        id: 'wg10',
        name: 'WG10 — OAM',
        description: 'Operations, Administration and Maintenance for O-RAN',
        specs: [
          {
            id: 'o-ran-wg10-oam',
            number: 'O-RAN.WG10',
            title: 'OAM Architecture and Interface Specifications',
            topics: ['O1 Interface', 'OAM', 'NETCONF', 'YANG', 'Performance Management', 'Fault Management', 'SMO', 'Configuration Management'],
            matchSpec: (s) => s.includes('WG10'),
          },
        ],
      },
      {
        id: 'wg11',
        name: 'WG11 — Security',
        description: 'O-RAN security requirements, threat modeling, and architecture',
        specs: [
          {
            id: 'o-ran-wg11-sec',
            number: 'O-RAN.WG11',
            title: 'Security Requirements and Controls Specifications',
            topics: ['Zero Trust Architecture (ZTA)', 'Post-Quantum Cryptography (PQC)', 'O-RAN Threat Model', 'Interface Security', 'AAD', 'Certificate Management'],
            matchSpec: (s) => s.includes('WG11'),
          },
        ],
      },
      {
        id: 'tifg',
        name: 'TIFG — Test & Integration',
        description: 'Test and integration focus group specifications',
        specs: [
          {
            id: 'o-ran-tifg',
            number: 'O-RAN.TIFG',
            title: 'End-to-End Test Specifications',
            topics: ['O-RAN Conformance Testing', 'E2E Testing', 'IOT', 'Test Lab', 'OTIC'],
            matchSpec: (s) => s.includes('TIFG'),
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // IETF
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'ietf',
    name: 'IETF',
    icon: '🌐',
    series: [
      {
        id: 'rfc-700s',
        name: 'RFC 700s — Transport',
        description: 'Core transport and datagram protocols',
        specs: [
          {
            id: 'rfc-768',
            number: 'RFC 768',
            title: 'User Datagram Protocol (UDP)',
            topics: ['UDP', 'Connectionless Transport', 'Port Numbers', 'Datagram'],
            matchSpec: (s) => s.includes('RFC 768') || s.includes('RFC768'),
          },
          {
            id: 'rfc-791',
            number: 'RFC 791',
            title: 'Internet Protocol (IPv4)',
            topics: ['IPv4', 'IP Header', 'Fragmentation', 'TTL', 'Protocol Field', 'Checksum'],
            matchSpec: (s) => /RFC\s*791/.test(s),
          },
          {
            id: 'rfc-793',
            number: 'RFC 793',
            title: 'Transmission Control Protocol (TCP)',
            topics: ['TCP', 'Connection-Oriented', 'Three-Way Handshake', 'Sliding Window', 'Retransmission'],
            matchSpec: (s) => /RFC\s*793/.test(s),
          },
        ],
      },
      {
        id: 'rfc-800s',
        name: 'RFC 800s — Link Layer',
        description: 'Link-layer protocols and address resolution',
        specs: [
          {
            id: 'rfc-826',
            number: 'RFC 826',
            title: 'Ethernet Address Resolution Protocol (ARP)',
            topics: ['ARP', 'MAC Address Resolution', 'ARP Cache', 'Gratuitous ARP'],
            matchSpec: (s) => /RFC\s*826/.test(s),
          },
          {
            id: 'rfc-919',
            number: 'RFC 919',
            title: 'Broadcasting Internet Datagrams',
            topics: ['Broadcast', 'Directed Broadcast', 'Limited Broadcast', 'Subnet Broadcast'],
            matchSpec: (s) => /RFC\s*919/.test(s),
          },
        ],
      },
      {
        id: 'rfc-1000s',
        name: 'RFC 1000s — Internet Standards',
        description: 'Foundational Internet host and naming requirements',
        specs: [
          {
            id: 'rfc-1034',
            number: 'RFC 1034 / RFC 1035',
            title: 'Domain Names — Concepts and Facilities / Implementation',
            topics: ['DNS', 'Domain Name', 'Resolver', 'Authoritative Server', 'Zone', 'Resource Record'],
            matchSpec: (s) => /RFC\s*1034/.test(s) || /RFC\s*1035/.test(s),
          },
          {
            id: 'rfc-1112',
            number: 'RFC 1112',
            title: 'Host Extensions for IP Multicasting (IGMPv1)',
            topics: ['IGMP', 'Multicast', 'Group Membership', 'Class D'],
            matchSpec: (s) => /RFC\s*1112/.test(s),
          },
          {
            id: 'rfc-1122',
            number: 'RFC 1122',
            title: 'Requirements for Internet Hosts — Communication Layers',
            topics: ['Host Requirements', 'IP', 'TCP', 'ICMP', 'TTL Defaults', 'Host Behavior'],
            matchSpec: (s) => /RFC\s*1122/.test(s),
          },
          {
            id: 'rfc-1918',
            number: 'RFC 1918',
            title: 'Address Allocation for Private Internets',
            topics: ['Private IP', '10.0.0.0/8', '172.16.0.0/12', '192.168.0.0/16', 'NAT', 'Private Networks'],
            matchSpec: (s) => /RFC\s*1918/.test(s),
          },
        ],
      },
      {
        id: 'rfc-2000s',
        name: 'RFC 2000s — QoS, DHCP, Routing',
        description: 'Quality of Service, address management, and routing protocols',
        specs: [
          {
            id: 'rfc-2131',
            number: 'RFC 2131',
            title: 'Dynamic Host Configuration Protocol (DHCP)',
            topics: ['DHCP', 'IP Address Assignment', 'Lease', 'DHCP Server', 'DHCP Relay'],
            matchSpec: (s) => /RFC\s*2131/.test(s),
          },
          {
            id: 'rfc-2328',
            number: 'RFC 2328',
            title: 'OSPF Version 2',
            topics: ['OSPF', 'Link-State Routing', 'LSDB', 'SPF Algorithm', 'Area', 'DR/BDR'],
            matchSpec: (s) => /RFC\s*2328/.test(s),
          },
          {
            id: 'rfc-2474',
            number: 'RFC 2474 / RFC 2475',
            title: 'Differentiated Services (DiffServ)',
            topics: ['DSCP', 'DiffServ', 'PHB', 'Traffic Classification', 'QoS Marking', 'EF', 'AF'],
            matchSpec: (s) => /RFC\s*2474/.test(s) || /RFC\s*2475/.test(s),
          },
        ],
      },
      {
        id: 'rfc-3000s',
        name: 'RFC 3000s — NAT, RoHC, BCP38',
        description: 'Network address translation, header compression, and ingress filtering',
        specs: [
          {
            id: 'rfc-3022',
            number: 'RFC 3022',
            title: 'Traditional IP Network Address Translator (NAT)',
            topics: ['NAT', 'Port Address Translation (PAT)', 'NAPT', 'Private to Public Mapping'],
            matchSpec: (s) => /RFC\s*3022/.test(s),
          },
          {
            id: 'rfc-3095',
            number: 'RFC 3095',
            title: 'Robust Header Compression (RoHC) Framework',
            topics: ['RoHC', 'Header Compression', 'PDCP', 'UDP/IP Header', 'Compression Profiles'],
            matchSpec: (s) => /RFC\s*3095/.test(s),
          },
          {
            id: 'rfc-3704',
            number: 'RFC 3704',
            title: 'Ingress Filtering for Multihomed Networks (BCP 84)',
            topics: ['BCP38', 'Ingress Filtering', 'uRPF', 'Spoofing Prevention', 'DDoS Mitigation'],
            matchSpec: (s) => /RFC\s*3704/.test(s),
          },
          {
            id: 'rfc-3927',
            number: 'RFC 3927',
            title: 'Dynamic Configuration of IPv4 Link-Local Addresses',
            topics: ['Link-Local', '169.254.0.0/16', 'Zero-Config', 'ARP Probe'],
            matchSpec: (s) => /RFC\s*3927/.test(s),
          },
        ],
      },
      {
        id: 'rfc-4000s',
        name: 'RFC 4000s — IPv6, BGP, Security',
        description: 'IPv6, routing, and security protocols',
        specs: [
          {
            id: 'rfc-4271',
            number: 'RFC 4271',
            title: 'Border Gateway Protocol 4 (BGP-4)',
            topics: ['BGP', 'Path Vector', 'AS Path', 'Route Policy', 'IBGP', 'EBGP'],
            matchSpec: (s) => /RFC\s*4271/.test(s),
          },
          {
            id: 'rfc-4291',
            number: 'RFC 4291',
            title: 'IP Version 6 Addressing Architecture',
            topics: ['IPv6', 'Link-Local Address', 'Global Unicast', 'Multicast', 'EUI-64', 'Interface ID'],
            matchSpec: (s) => /RFC\s*4291/.test(s),
          },
          {
            id: 'rfc-4301',
            number: 'RFC 4301 / RFC 7296',
            title: 'Security Architecture for the Internet Protocol (IPsec) / IKEv2',
            topics: ['IPsec', 'IKEv2', 'SA', 'ESP', 'AH', 'Tunnel Mode', 'Key Exchange'],
            matchSpec: (s) => /RFC\s*4301/.test(s) || /RFC\s*7296/.test(s),
          },
          {
            id: 'rfc-4632',
            number: 'RFC 4632',
            title: 'Classless Inter-Domain Routing (CIDR)',
            topics: ['CIDR', 'Prefix Length', 'Route Aggregation', 'Supernetting', 'VLSM'],
            matchSpec: (s) => /RFC\s*4632/.test(s),
          },
          {
            id: 'rfc-4861',
            number: 'RFC 4861',
            title: 'Neighbor Discovery for IP version 6 (NDP)',
            topics: ['NDP', 'Neighbor Solicitation', 'Neighbor Advertisement', 'Router Discovery', 'SLAAC'],
            matchSpec: (s) => /RFC\s*4861/.test(s),
          },
          {
            id: 'rfc-4960',
            number: 'RFC 4960',
            title: 'Stream Control Transmission Protocol (SCTP)',
            topics: ['SCTP', 'Multi-Homing', 'Multi-Streaming', 'Association', 'Chunks', 'Heartbeat'],
            matchSpec: (s) => /RFC\s*4960/.test(s),
          },
        ],
      },
      {
        id: 'rfc-6000s',
        name: 'RFC 6000s+ — Modern Protocols',
        description: 'Network management, IPv6 enhancements, and modern protocol updates',
        specs: [
          {
            id: 'rfc-6241',
            number: 'RFC 6241',
            title: 'Network Configuration Protocol (NETCONF)',
            topics: ['NETCONF', 'YANG', 'SSH Transport', 'Configuration Management', 'RPC', 'Datastore', 'O1 Interface'],
            matchSpec: (s) => /RFC\s*6241/.test(s),
          },
          {
            id: 'rfc-6335',
            number: 'RFC 6335',
            title: 'Internet Assigned Numbers Authority (IANA) Service Name and Port Number Registry',
            topics: ['Port Numbers', 'Well-Known Ports', 'Registered Ports', 'Service Names'],
            matchSpec: (s) => /RFC\s*6335/.test(s),
          },
          {
            id: 'rfc-8200',
            number: 'RFC 8200',
            title: 'Internet Protocol, Version 6 (IPv6) Specification',
            topics: ['IPv6', 'Extension Headers', 'Flow Label', 'Next Header', 'Fragmentation'],
            matchSpec: (s) => /RFC\s*8200/.test(s),
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // Open-source / Industry
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'open-source',
    name: 'Open-source',
    icon: '🛠',
    series: [
      {
        id: 'ieee',
        name: 'IEEE Standards',
        description: 'IEEE networking and hardware standards',
        specs: [
          {
            id: 'ieee-802-1d',
            number: 'IEEE 802.1D',
            title: 'MAC Bridges and Virtual Bridged Local Area Networks',
            topics: ['Ethernet Bridge', 'STP', 'MAC Learning', 'Forwarding Database', 'Port States'],
            matchSpec: (s) => s.includes('802.1D'),
          },
          {
            id: 'ieee-802-1q',
            number: 'IEEE 802.1Q',
            title: 'Virtual LANs (VLANs)',
            topics: ['VLAN', '802.1Q Tag', 'VLAN ID (VID)', 'Trunk Port', 'Access Port', 'PVID'],
            matchSpec: (s) => s.includes('802.1Q'),
          },
          {
            id: 'ieee-802-3',
            number: 'IEEE 802.3',
            title: 'Ethernet Standard',
            topics: ['Ethernet', 'MAC Frame', 'CSMA/CD', '10/100/1000/10G Ethernet', 'PHY Layer', 'MDI/MDIX'],
            matchSpec: (s) => /802\.3(?!ab)/.test(s),
          },
          {
            id: 'ieee-802-3ab',
            number: 'IEEE 802.3ab',
            title: 'Gigabit Ethernet over Twisted Pair (1000BASE-T)',
            topics: ['1000BASE-T', 'Gigabit Ethernet', 'Cat5e/Cat6', '4-pair operation'],
            matchSpec: (s) => s.includes('802.3ab'),
          },
          {
            id: 'ieee-1149-1',
            number: 'IEEE 1149.1',
            title: 'Standard Test Access Port and Boundary Scan Architecture (JTAG)',
            topics: ['JTAG', 'Boundary Scan', 'TAP', 'Debug Interface', 'FPGA Programming'],
            matchSpec: (s) => s.includes('1149.1'),
          },
          {
            id: 'ieee-1588',
            number: 'IEEE Std 1588',
            title: 'Precision Time Protocol (PTP)',
            topics: ['PTP', 'Precision Timing', 'Grandmaster Clock', 'Boundary Clock', 'Transparent Clock', 'SyncE', 'Fronthaul Sync'],
            matchSpec: (s) => s.includes('1588'),
          },
        ],
      },
      {
        id: 'cncf',
        name: 'CNCF & Open Container',
        description: 'Cloud-native computing foundation and container standards',
        specs: [
          {
            id: 'oci-runtime',
            number: 'OCI Runtime Spec',
            title: 'Open Container Initiative (OCI) Runtime & Image Specifications',
            topics: ['Container', 'OCI Image', 'Container Runtime', 'runc', 'Container Filesystem', 'Namespace', 'Cgroups'],
            matchSpec: (s) => s.includes('OCI'),
          },
          {
            id: 'cncf-kubernetes',
            number: 'CNCF Kubernetes',
            title: 'Kubernetes Container Orchestration',
            topics: ['Kubernetes', 'Pod', 'Node', 'Deployment', 'Service', 'ConfigMap', 'Namespace', 'CNI', 'Kubelet'],
            matchSpec: (s) => s.includes('Kubernetes'),
          },
          {
            id: 'cncf-helm',
            number: 'CNCF Helm',
            title: 'Helm — The Kubernetes Package Manager',
            topics: ['Helm', 'Chart', 'Release', 'values.yaml', 'Templates', 'Helm Repository'],
            matchSpec: (s) => s.includes('Helm'),
          },
        ],
      },
      {
        id: 'dpdk-sriov',
        name: 'DPDK & Hardware Acceleration',
        description: 'Data plane development kit and hardware offload specifications',
        specs: [
          {
            id: 'dpdk',
            number: 'Linux Foundation DPDK',
            title: 'Data Plane Development Kit (DPDK)',
            topics: ['DPDK', 'Kernel Bypass', 'PMD', 'Hugepages', 'NUMA', 'Poll Mode', 'VirtIO', 'vSwitch', 'Packet Processing'],
            matchSpec: (s) => s.includes('DPDK'),
          },
          {
            id: 'pcie-base',
            number: 'PCI-SIG PCIe Base Spec',
            title: 'PCI Express Base Specification',
            topics: ['PCIe', 'Lane', 'Gen3/Gen4/Gen5', 'DMA', 'MSI-X', 'IOMMU', 'TLP'],
            matchSpec: (s) => s.includes('PCIe') && !s.includes('SR-IOV'),
          },
          {
            id: 'pcie-sriov',
            number: 'PCI-SIG SR-IOV Spec',
            title: 'Single Root I/O Virtualization (SR-IOV)',
            topics: ['SR-IOV', 'VF', 'PF', 'NIC Virtualization', 'PCIe Passthrough', 'Virtual Function', 'vRAN Acceleration'],
            matchSpec: (s) => s.includes('SR-IOV'),
          },
        ],
      },
      {
        id: 'industry-specs',
        name: 'Industry & Vendor Specifications',
        description: 'eCPRI, NVMe, UEFI, JEDEC, POSIX, and other industry standards',
        specs: [
          {
            id: 'ecpri',
            number: 'eCPRI Spec v2.0',
            title: 'evolved Common Public Radio Interface (eCPRI)',
            topics: ['eCPRI', 'Fronthaul', 'IQ Data Transport', 'Ethernet/IP Transport', 'Low Latency', 'O-RU to O-DU'],
            matchSpec: (s) => s.includes('eCPRI'),
          },
          {
            id: 'cpri',
            number: 'CPRI Spec v7.0',
            title: 'Common Public Radio Interface (CPRI)',
            topics: ['CPRI', 'Fronthaul', 'IQ Samples', 'RRH to BBU', 'Fiber Link', 'Line Bit Rate'],
            matchSpec: (s) => s.includes('CPRI') && !s.includes('eCPRI'),
          },
          {
            id: 'nvme',
            number: 'NVMe Specification',
            title: 'Non-Volatile Memory Express (NVMe)',
            topics: ['NVMe', 'PCIe SSD', 'Queue Pairs', 'Namespace', 'NVMe-oF', 'Latency', 'IOPS'],
            matchSpec: (s) => s.includes('NVMe'),
          },
          {
            id: 'uefi',
            number: 'UEFI Forum Spec',
            title: 'Unified Extensible Firmware Interface (UEFI)',
            topics: ['UEFI', 'Secure Boot', 'Boot Manager', 'GPT', 'EFI Application', 'Firmware Interface'],
            matchSpec: (s) => s.includes('UEFI'),
          },
          {
            id: 'jedec',
            number: 'JEDEC Specifications',
            title: 'JEDEC Memory Standards (JESD79 series)',
            topics: ['DDR4', 'DDR5', 'LPDDR', 'DRAM Timing', 'ECC Memory', 'SPD', 'Memory Module'],
            matchSpec: (s) => s.includes('JEDEC'),
          },
          {
            id: 'fapi',
            number: 'Small Cell Forum FAPI',
            title: 'Femtocell API (FAPI) — PHY API Specification',
            topics: ['FAPI', 'PHY API', 'L1/L2 Interface', 'DL/UL Config PDU', 'RACH Indication', 'Open RAN PHY'],
            matchSpec: (s) => s.includes('FAPI'),
          },
          {
            id: 'etsi-mec',
            number: 'ETSI GS MEC 003',
            title: 'Multi-access Edge Computing (MEC) — Framework and Reference Architecture',
            topics: ['MEC', 'Edge Computing', 'MEP', 'MEPM', 'MEC App', 'UPF Offload'],
            matchSpec: (s) => s.includes('MEC'),
          },
          {
            id: 'arm-arch',
            number: 'Arm Architecture Reference Manual',
            title: 'Arm Architecture Reference Manual (AArch64)',
            topics: ['ARM', 'AArch64', 'A64 ISA', 'Exception Levels', 'MMU', 'TrustZone', 'NEON/SVE'],
            matchSpec: (s) => s.includes('Arm Architecture'),
          },
        ],
      },
    ],
  },
];

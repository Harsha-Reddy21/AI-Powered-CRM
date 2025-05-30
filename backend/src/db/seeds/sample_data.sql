-- Sample Users
INSERT INTO users (id, full_name, role) VALUES
  ('d7bed82c-5f89-4d49-9fde-a380bc87e1b7', 'John Manager', 'manager'),
  ('e9b9d6a2-8f7c-4d1a-9f3c-b2a5d8d7e4c1', 'Alice Sales', 'sales_rep'),
  ('f1c3b8a7-6d5e-4f2d-8c9b-a1b2c3d4e5f6', 'Bob Admin', 'admin');

-- Sample Companies
INSERT INTO companies (id, name, industry, website, created_by) VALUES
  ('a1b2c3d4-e5f6-4a5b-8c9d-1a2b3c4d5e6f', 'Acme Corp', 'Technology', 'www.acme.com', 'd7bed82c-5f89-4d49-9fde-a380bc87e1b7'),
  ('b2c3d4e5-f6a7-5b6c-9d0e-2b3c4d5e6f7a', 'Beta Industries', 'Manufacturing', 'www.beta.com', 'e9b9d6a2-8f7c-4d1a-9f3c-b2a5d8d7e4c1');

-- Sample Contacts
INSERT INTO contacts (id, first_name, last_name, email, company_id, owner_id) VALUES
  ('c3d4e5f6-a7b8-6c7d-0e1f-3b4c5d6e7f8a', 'Sarah', 'Smith', 'sarah@acme.com', 'a1b2c3d4-e5f6-4a5b-8c9d-1a2b3c4d5e6f', 'd7bed82c-5f89-4d49-9fde-a380bc87e1b7'),
  ('d4e5f6a7-b8c9-7d8e-1f2g-4c5d6e7f8a9b', 'Mike', 'Johnson', 'mike@beta.com', 'b2c3d4e5-f6a7-5b6c-9d0e-2b3c4d5e6f7a', 'e9b9d6a2-8f7c-4d1a-9f3c-b2a5d8d7e4c1');

-- Sample Pipeline
INSERT INTO pipelines (id, name, description) VALUES
  ('e5f6a7b8-c9d0-8e9f-2g3h-5d6e7f8a9b0c', 'Sales Pipeline', 'Main sales process');

-- Sample Pipeline Stages
INSERT INTO pipeline_stages (id, pipeline_id, name, order_index) VALUES
  ('f6a7b8c9-d0e1-9f0g-3h4i-6e7f8a9b0c1d', 'e5f6a7b8-c9d0-8e9f-2g3h-5d6e7f8a9b0c', 'Initial Contact', 1),
  ('a7b8c9d0-e1f2-0g1h-4i5j-7f8a9b0c1d2e', 'e5f6a7b8-c9d0-8e9f-2g3h-5d6e7f8a9b0c', 'Negotiation', 2),
  ('b8c9d0e1-f2g3-1h2i-5j6k-8a9b0c1d2e3f', 'e5f6a7b8-c9d0-8e9f-2g3h-5d6e7f8a9b0c', 'Closed', 3);

-- Sample Deals
INSERT INTO deals (id, name, amount, pipeline_id, stage_id, owner_id, company_id, status) VALUES
  ('c9d0e1f2-g3h4-2i3j-6k7l-9b0c1d2e3f4g', 'Acme Software License', 50000, 'e5f6a7b8-c9d0-8e9f-2g3h-5d6e7f8a9b0c', 'f6a7b8c9-d0e1-9f0g-3h4i-6e7f8a9b0c1d', 'd7bed82c-5f89-4d49-9fde-a380bc87e1b7', 'a1b2c3d4-e5f6-4a5b-8c9d-1a2b3c4d5e6f', 'open'),
  ('d0e1f2g3-h4i5-3j4k-7l8m-0c1d2e3f4g5h', 'Beta Manufacturing Deal', 75000, 'e5f6a7b8-c9d0-8e9f-2g3h-5d6e7f8a9b0c', 'a7b8c9d0-e1f2-0g1h-4i5j-7f8a9b0c1d2e', 'e9b9d6a2-8f7c-4d1a-9f3c-b2a5d8d7e4c1', 'b2c3d4e5-f6a7-5b6c-9d0e-2b3c4d5e6f7a', 'open');

-- Sample Activities
INSERT INTO activities (id, type, title, owner_id, deal_id, contact_id) VALUES
  ('e1f2g3h4-i5j6-4k5l-8m9n-1d2e3f4g5h6i', 'call', 'Initial Discussion', 'd7bed82c-5f89-4d49-9fde-a380bc87e1b7', 'c9d0e1f2-g3h4-2i3j-6k7l-9b0c1d2e3f4g', 'c3d4e5f6-a7b8-6c7d-0e1f-3b4c5d6e7f8a'),
  ('f2g3h4i5-j6k7-5l6m-9n0o-2e3f4g5h6i7j', 'meeting', 'Product Demo', 'e9b9d6a2-8f7c-4d1a-9f3c-b2a5d8d7e4c1', 'd0e1f2g3-h4i5-3j4k-7l8m-0c1d2e3f4g5h', 'd4e5f6a7-b8c9-7d8e-1f2g-4c5d6e7f8a9b');

-- Sample Tags
INSERT INTO tags (id, name, color) VALUES
  ('g3h4i5j6-k7l8-6m7n-0o1p-3f4g5h6i7j8k', 'High Priority', '#FF0000'),
  ('h4i5j6k7-l8m9-7n8o-1p2q-4g5h6i7j8k9l', 'New Client', '#00FF00');

-- Sample Tag Assignments
INSERT INTO contact_tags (contact_id, tag_id) VALUES
  ('c3d4e5f6-a7b8-6c7d-0e1f-3b4c5d6e7f8a', 'g3h4i5j6-k7l8-6m7n-0o1p-3f4g5h6i7j8k'),
  ('d4e5f6a7-b8c9-7d8e-1f2g-4c5d6e7f8a9b', 'h4i5j6k7-l8m9-7n8o-1p2q-4g5h6i7j8k9l');

INSERT INTO deal_tags (deal_id, tag_id) VALUES
  ('c9d0e1f2-g3h4-2i3j-6k7l-9b0c1d2e3f4g', 'g3h4i5j6-k7l8-6m7n-0o1p-3f4g5h6i7j8k'),
  ('d0e1f2g3-h4i5-3j4k-7l8m-0c1d2e3f4g5h', 'h4i5j6k7-l8m9-7n8o-1p2q-4g5h6i7j8k9l'); 
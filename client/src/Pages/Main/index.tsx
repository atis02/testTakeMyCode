import React, { useState, useEffect, useRef } from "react";
import {
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  TablePagination,
  CircularProgress,
  Stack,
  Container,
  Box,
} from "@mui/material";
import axiosInstance from "../../components/utils";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

interface Item {
  id: number;
  position: number;
  value: string;
  selected: boolean;
}

interface Total {
  total: number;
  page: number;
  totalPages: number;
  sortOrder: string;
}

const TableComponent: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState<Total>();
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<number[]>([]);
  const tableContainerRef = useRef<HTMLDivElement | null>(null);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/api/v1/allData`, {
        params: { page, search, limit: 1 },
      });
      setTotalItems(response.data);
      if (page === 1) {
        setItems(response.data.data);
      } else {
        setItems((prevItems) => [...prevItems, ...response.data.data]);
      }
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchItems();
  }, [page, search]);

  const handleScroll = () => {
    if (tableContainerRef.current) {
      const { scrollHeight, scrollTop, clientHeight } =
        tableContainerRef.current;

      if (scrollHeight - scrollTop <= clientHeight + 10) {
        if (!loading) {
          console.log("Scrolling to the bottom");
          setPage((prev) => prev + 1);
        }
      }
    }
  };

  useEffect(() => {
    if (tableContainerRef.current) {
      tableContainerRef.current.addEventListener("scroll", handleScroll);
      return () => {
        if (tableContainerRef.current) {
          tableContainerRef.current.removeEventListener("scroll", handleScroll);
        }
      };
    }
  }, []);

  useEffect(() => {
    if (page > 1) {
      fetchItems();
    }
  }, [page]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
    setPage(1);
  };

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const allIds = items.map((item) => item.id);
      setSelected(allIds);
      axiosInstance
        .post("/api/v1/updateSelected", { selected: allIds })
        .catch(console.error);
    } else {
      setSelected([]);
    }
  };
  const Select = async (id: any) => {
    console.log(id);

    setSelected((prev: any) => {
      const updatedSelected = [...prev, id];
      console.log({ selected: updatedSelected });
      setLoading(true);
      axiosInstance
        .post("/api/v1/updateSelected", { selected: updatedSelected })
        .then(() => {
          setLoading(false);
          fetchItems();
        })

        .catch((error) => {
          setLoading(false);
          console.error(error);
        });

      return updatedSelected; // Return the new state
    });
  };
  const handleSelectItem = (id: number) => {
    Select(id);
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const reorderedItems = [...items];
    const [movedItem] = reorderedItems.splice(result.source.index, 1);
    reorderedItems.splice(result.destination.index, 0, movedItem);

    const updatedItems = reorderedItems.map((item, index) => ({
      ...item,
      position: index + 1,
      oldPosition: item.position,
    }));

    axiosInstance
      .post("/api/v1/updateOrder", { newOrder: updatedItems })
      .then(() => {
        console.log("Order updated successfully");
        setItems(updatedItems);
      })
      .catch((error) => {
        console.error("Error updating order", error);
      });
    console.log(updatedItems);
  };

  return (
    <Container>
      <Box mt={2}>
        <TextField
          label="Search"
          value={search}
          onChange={handleSearch}
          variant="outlined"
          fullWidth
        />
        {loading ? (
          <Stack
            minHeight="100vh"
            width="100%"
            alignItems="center"
            justifyContent="center"
          >
            <CircularProgress />
          </Stack>
        ) : (
          <DragDropContext onDragEnd={handleDragEnd}>
            <TableContainer
              ref={tableContainerRef}
              onScroll={handleScroll}
              style={{ maxHeight: "83vh", overflowY: "auto" }}
            >
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell
                      sx={{
                        width: "10px",
                      }}
                    >
                      №
                    </TableCell>

                    <TableCell>
                      <Checkbox
                        onChange={handleSelectAll}
                        checked={selected.length === items.length}
                      />
                      All
                    </TableCell>
                    <TableCell>Name</TableCell>
                  </TableRow>
                </TableHead>
                <Droppable droppableId="table">
                  {(provided) => (
                    <TableBody
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                    >
                      {items
                        .sort((a, b) => a.position - b.position)
                        .map((item, index) => (
                          <Draggable
                            key={item.id.toString()}
                            draggableId={item.id.toString()}
                            index={index}
                          >
                            {(provided, snapshot) => (
                              <TableRow
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                style={{
                                  backgroundColor: snapshot.isDragging
                                    ? "#f0f0f0"
                                    : "white",
                                  ...provided.draggableProps.style,
                                }}
                              >
                                <TableCell>{index + 1}</TableCell>{" "}
                                <TableCell>
                                  <Checkbox
                                    checked={item.selected}
                                    onChange={() => handleSelectItem(item.id)}
                                  />
                                </TableCell>
                                <TableCell>{item.value}</TableCell>
                              </TableRow>
                            )}
                          </Draggable>
                        ))}
                      {provided.placeholder}
                    </TableBody>
                  )}
                </Droppable>
              </Table>
            </TableContainer>
          </DragDropContext>
        )}
        <TablePagination
          rowsPerPageOptions={[20]}
          component="div"
          count={totalItems?.total || 0}
          rowsPerPage={20}
          page={page - 1}
          onPageChange={(_event, newPage) => setPage(newPage + 1)}
        />
      </Box>
    </Container>
  );
};

export default TableComponent;

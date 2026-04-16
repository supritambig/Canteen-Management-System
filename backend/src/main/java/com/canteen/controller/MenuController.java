package com.canteen.controller;

import com.canteen.model.MenuItem;
import com.canteen.repository.MenuItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/menu")
public class MenuController {

    @Autowired
    private MenuItemRepository menuRepository;

    @GetMapping
    public List<MenuItem> getAvailableMenu() {
        return menuRepository.findByAvailableTrue();
    }

    @GetMapping("/all")
    public List<MenuItem> getAllMenu() {
        return menuRepository.findAll();
    }

    @PostMapping
    public MenuItem addMenuItem(@RequestBody MenuItem item) {
        return menuRepository.save(item);
    }

    @PutMapping("/{id}/toggle")
    public ResponseEntity<?> toggleAvailability(@PathVariable Long id) {
        return menuRepository.findById(id).map(item -> {
            item.setAvailable(!item.isAvailable());
            menuRepository.save(item);
            return ResponseEntity.ok(item);
        }).orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/restock")
    public ResponseEntity<?> restockItem(@PathVariable Long id, @RequestParam Integer amount) {
        return menuRepository.findById(id).map(item -> {
            item.setStockQuantity((item.getStockQuantity() != null ? item.getStockQuantity() : 0) + amount);
            item.setAvailable(item.getStockQuantity() > 0);
            menuRepository.save(item);
            return ResponseEntity.ok(item);
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteItem(@PathVariable Long id) {
        if(menuRepository.existsById(id)) {
            menuRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}
